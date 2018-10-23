import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    @ViewChild('activateUser') activateUserModal;
    @ViewChild('deactivateUser') deactivateUserModal;

    userIDForActivation = null


    UserProperties = [
        'UserName',
        'FirstName',
        'LastName',
        'Role',
        'Active',
        ''
    ];

    UserList: User[]


    constructor(private userService: UserService, private modalService: NgbModal) {

    }

    ngOnInit() {
        this.getAddedUsers()
    }

    getAddedUsers() {
        this.userService.getAlluser().subscribe(
            (res) => {
                //
                console.log(res["data"])
                this.UserList = res["data"];
            },
            (error) => { }
        )

    }

    updateUser(evt) {
        this.sendUserName.emit(evt.target.id)
    }

    deactivateUser() {


    }

    activateUser() {


    }

    showAlertModalForUserAction(evt) {
        this.userIDForActivation = evt.target.id
        if (evt.target.checked) {
            this.modalService.open(this.activateUserModal)
        }
        else {
            this.modalService.open(this.deactivateUserModal)
        }
    }
}