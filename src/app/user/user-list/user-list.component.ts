import { Component, OnInit, Input } from '@angular/core';

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
    templateUrl: 'user-list.component.html'
})

export class UserListComponent implements OnInit {

    UserProperties = [
        'UserName',
        'FirstName',
        'LastName',
        'Role',
        'Status',
        '' 
    ];

    UserList: User[] = [
        { UserName: 'ABC', FirstName: 'ASDF', LastName: 'asdewr', Role: 'office', Status: 'active' },
        { UserName: 'ABC', FirstName: 'ASDF', LastName: 'asdewr', Role: 'office', Status: 'active' },
        { UserName: 'ABC', FirstName: 'ASDF', LastName: 'asdewr', Role: 'office', Status: 'active' }
    ]

    ngOnInit() {
    }

    constructor() {

    }
}