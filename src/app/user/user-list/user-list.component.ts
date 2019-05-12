import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface User {
    UserName: string,
    FirstName: string,
    LastName: string,
    Role: string,
    Status: string
}

@Component({
    selector: 'user-list-cmp',
    moduleId: module.id,
    templateUrl: 'user-list.component.html',
    styleUrls: ['user.component.css']
})

export class UserListComponent implements OnInit {

    @Output() sendUserName: EventEmitter<any> = new EventEmitter<any>();
    //@ViewChild('addUser') addUserModal;

    userIDForActivation = null

    userProperties = [
        'Username',
        'First Name',
        'Last Name',
        'Role',
        ''
    ];
    updateMode: boolean
    userList: User[]
    userForm: FormGroup

    constructor(public _fb: FormBuilder, private userService: UserService,
          private toastrService: ToastrService,
          private modalService: NgbModal) {

    }

    ngOnInit() {
        this.getAddedUsers()
        this.updateMode = false;
        this.userForm = this._fb.group({
            username: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            role: ['', Validators.required],
            //active: []

        })
    }

    getAddedUsers() {
        this.userService.getAlluser().subscribe(
            (res) => {
                //
                console.log(res["data"])
                this.userList = res["data"];
            },
            (error) => { }
        )

    }

    openUserEntryForm(content){
      this.modalService.open(content);
    }

    resetForm(){
      this.userForm.reset();
    }

    submit(){
      if (this.userForm.invalid)
          return

      if (this.userForm.controls.password.value !== this.userForm.controls.confirmpassword.value) {
          this.toastrService.error("Password and Confirm password do not match");
          return;
      }
      // let userData = {
      //     username: this.userForm.controls.username.value,
      //     firstName: this.userForm.controls.firstname.value,
      //     lastName: this.userForm.controls.lastname.value,
      //     password: this.userForm.controls.password.value,
      //     role: this.userForm.controls.role.value,
      //     //active: JSON.parse(this.userForm.controls.active.value)
      // }
      let userData = this.userForm.getRawValue();

      this.userService.addUser(userData).subscribe(
          (res) => {
            if(res.success){
              this.toastrService.success("User is added successfully")
              this.userList.push(userData);
            }else{
              this.toastrService.error(res.message);
            }
          },
          (error) => {
              this.toastrService.error("Fail to add user to database please contact Admin", "User Add failure")
          }
      )
    }
    updateUser(evt) {
        this.sendUserName.emit(evt.target.id)
    }
}
