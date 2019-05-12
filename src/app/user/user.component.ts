import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { UserService } from '../services/user.service'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    styleUrls:['user.component.css']
})

export class UserComponent implements OnInit {

    @ViewChild('userlist') userlist;

    isUserCreateMode = true;
    isUserPasswordUpdate = true;
    usernameDuplicate = false;

    ngOnInit() {
    }

    constructor(public userInfo: FormBuilder, private userService: UserService, private toastrService: ToastrService, private router: Router) {

    }

    userForm = this.userInfo.group({
        username: [],
        firstname: [],
        lastname: [],
        password: [],
        confirmpassword: [],
        role: [],
        //active: []

    })

    onSubmitUserCreate() {
        if (this.userForm.invalid)
            return

        if (this.userForm.controls.password.value !== this.userForm.controls.confirmpassword.value) {
            this.toastrService.error("Password and Confirm password do not match");
            return;
        }
        let userData = {
            username: this.userForm.controls.username.value,
            firstName: this.userForm.controls.firstname.value,
            lastName: this.userForm.controls.lastname.value,
            password: this.userForm.controls.password.value,
            role: this.userForm.controls.role.value,
            //active: JSON.parse(this.userForm.controls.active.value)
        }


        this.userService.addUser(userData).subscribe(
            (data) => {
                this.toastrService.success("User is added successfully")
                this.userlist.getAddedUsers();
            },
            (error) => {

                this.toastrService.error("Fail to add user to database please contact Admin", "User Add failure")
            }
        )

    }

    onUpdateSubmit() {
        let _userName = this.userForm.controls.username.value;
        this.isUserCreateMode = false
        let userData = {
            username: this.userForm.controls.username.value,
            firstName: this.userForm.controls.firstname.value,
            lastName: this.userForm.controls.lastname.value,
            role: this.userForm.controls.role.value,
            //active: JSON.parse(this.userForm.controls.active.value)
        }



        this.getUserPassWord(_userName).then((data) => {
            data['username'] = this.userForm.controls.username.value;
            data['firstName'] = this.userForm.controls.firstname.value;
            data['lastName'] = this.userForm.controls.lastname.value;
            data['role'] = this.userForm.controls.role.value;
            //data['active'] = JSON.parse(this.userForm.controls.active.value);

            delete data["authorities"]
            this.userService.updateUser(data).subscribe((res) => {
                this.userlist.getAddedUsers();
                console.log(res);
            })
        })


    }

    getUserToupdate(id) {
        this.setUserUpdateMode();

        this.userService.getOneuser(id).subscribe((res) => {
            //console.log(res)
            this.toastrService.success("You are in upadating process please click cancel to exit")
            this.userForm.controls.username.setValue(res['data']['username']);
            this.userForm.controls.firstname.setValue(res['data']['firstName']);
            this.userForm.controls.lastname.setValue(res['data']['lastName']);
            this.userForm.controls.role.setValue(res['data']['role']);
            //this.userForm.controls.active.setValue(res['data']['active']);
        },
            () => {
                this.toastrService.error("User Data is not found");
            })
    }

    setUserUpdateMode() {
        this.isUserCreateMode = false
        this.isUserPasswordUpdate = false
        this.userForm.controls.username.disable();
    }

    //this is a temporary code
    getUserPassWord(userName) {
        return new Promise((resolve, reject) => {
            this.userService.getOneuser(userName).subscribe((res) => {
                resolve(res['data'])
            })
        })
    }

    cancelUpdateUser() {
        this.router.navigate(['adduser'])
        this.isUserCreateMode = true
        this.isUserPasswordUpdate = true
        this.userForm.reset()
        this.userForm.controls.username.enable();
    }

    checkUserNameAvailability() {
        let _username = this.userForm.controls.username.value;
        this.usernameDuplicate = false;
        this.userlist.UserList.forEach(element => {
            if (_username == element.username) {
                this.usernameDuplicate = true;
                this.toastrService.error('username is already present')
                return;
            }
        });
    }
}
