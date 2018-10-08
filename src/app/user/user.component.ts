import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
    ngOnInit() {
    }

    constructor(public userInfo: FormBuilder) {

    }

    userForm = this.userInfo.group({
        username: [],
        firstname: [],
        lastname: [],
        password: [],
        role: [],
        selectStatus: []
    })

    onSubmitUserCreate() {
        if (this.userForm.invalid)
            return
    }
}
