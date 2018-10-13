import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { UserService } from '../services/user.service'
import { ToastrService } from 'ngx-toastr'

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

    @ViewChild('userlist') userlist;

    ngOnInit() {
    }

    constructor(public userInfo: FormBuilder, private userService: UserService, private toastrService: ToastrService) {

    }

    userForm = this.userInfo.group({
        username: [],
        firstname: [],
        lastname: [],
        password: [],
        confirmpassword: [],
        role: [],
        selectStatus: [],

    })

    onSubmitUserCreate() {
        if (this.userForm.invalid)
            return


        let userData = {
            username: this.userForm.controls.username.value,
            firstName: this.userForm.controls.firstname.value,
            lastName: this.userForm.controls.lastname.value,
            password: this.userForm.controls.password.value,
            role: this.userForm.controls.role.value,
            active: Boolean(this.userForm.controls.firstname.value)
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


}
