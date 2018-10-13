import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service'

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


    UserProperties = [
        'UserName',
        'FirstName',
        'LastName',
        'Role',
        'Active',
        ''
    ];

    UserList: User[]


    constructor(private userService: UserService) {

    }

    ngOnInit() {
        this.getAddedUsers()
    }

    getAddedUsers() {
        this.userService.getAlluser().subscribe(
            (res) => {
                //
                this.UserList = res["data"];
            },
            (error) => { }
        )

    }

    updateUserData() {
        console.log("update user")
    }
}