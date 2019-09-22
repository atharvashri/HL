import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'user-list-cmp',
    moduleId: module.id,
    templateUrl: 'user-list.component.html',
    styleUrls: ['user.component.css']
})

export class UserListComponent implements OnInit {

    @Output() sendUserName: EventEmitter<any> = new EventEmitter<any>();
    //@ViewChild('addUser') addUserModal;

    userProperties = [
        'Username',
        'First Name',
        'Last Name',
        'Role',
        ''
    ];
    updateMode: boolean
    userList: any[]
    userForm: FormGroup
    userIDForActivation = null
    popupTitle: string
    password
    confirmPassword
    usernameToUpdate
    usernameDuplicate = false;

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

    openAddUserModal(content){
      this.updateMode = false;
      this.userForm.controls.username.enable();
      this.popupTitle = "Add User";
      this.userForm.reset();
      this.modalService.open(content);
    }

    openUpdateUserModal(user, content){
        this.updateMode = true;
        this.popupTitle = "Update User";
        this.modalService.open(content);
        this.userForm.controls.username.setValue(user.username);
        this.userForm.controls.username.disable();
        this.userForm.controls.firstName.setValue(user.firstName);
        this.userForm.controls.lastName.setValue(user.lastName);
        this.userForm.controls.role.setValue(user.role);
    }

    openChangePasswordModal(user, content){
      this.usernameToUpdate = user.username;
      this.modalService.open(content);
    }

    resetForm(){
      this.userForm.reset();
    }

    submit(){
      if (this.userForm.invalid)
          return

      if (this.userForm.controls.password.value !== this.userForm.controls.confirmPassword.value) {
          this.toastrService.error("Password and Confirm password do not match");
          return;
      }

      let userData = this.userForm.getRawValue();

      this.userService.addUser(userData).subscribe(
          (res) => {
            if(res.success){
              this.modalService.dismissAll()
              this.toastrService.success(res.message)
              this.userList.push(userData);
            }else{
              this.toastrService.error(res.message);
            }
          },
          (error) => {
              this.toastrService.error("Fail to add user to database! Internal server error")
          }
      )
    }

    update(){
      let userData = this.userForm.getRawValue();

      this.userService.updateUser(userData).subscribe(
          (res) => {
            if(res.success){
              this.modalService.dismissAll()
              this.toastrService.success(res.message)
              let idx = this.userList.findIndex(user => user.username === res.data.username);
              if(idx > -1){
                this.userList[idx] = res.data;
              }
            }else{
              this.toastrService.error(res.message);
            }
          },
          (error) => {
              this.toastrService.error("Fail to update user details! Internal server error")
          }
      )
    }

    changePassword(){
      if(!this.password){
        this.toastrService.error("Password field can't be blank");
        return;
      }else if(this.password !== this.confirmPassword){
        this.toastrService.error("Password and Confirm Password don't match");
        return;
      }

      let userData ={
        'password': this.password
      }

      this.userService.changePassword(userData).subscribe(
          (res) => {
            if(res.success){
              this.modalService.dismissAll()
              this.toastrService.success(res.message)
            }else{
              this.toastrService.error(res.message);
            }
          },
          (error) => {
              this.toastrService.error("Fail to change password! Internal server error")
          }
      )
    }

    checkUserNameAvailability() {
        let _username = this.userForm.controls.username.value;
        this.usernameDuplicate = false;
        this.userList.forEach(element => {
            if (_username == element.username) {
                this.usernameDuplicate = true;
                this.toastrService.error('username is already present')
                return;
            }
        });
    }
}
