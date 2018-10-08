import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { LoginService } from '../../services/login.service'
import { Router } from '@angular/router'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    //   styleUrls: ['./app-raise-bill.css']
})
export class LoginComponent implements OnInit {

    constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

    ngOnInit() {
    }

    @Output() showsidebar = new EventEmitter<any>();

    loginForm = this.fb.group({
        userName: [],
        password: [],
        company: []
    })

    changeViewOnloggedIn(status) {
        this.showsidebar.emit(status);
    }

    isloggedIn() {
        return localStorage.getItem('isLogin');
    }

    submitLogin() {
        console.log(this.loginForm.get('userName').value)
        if (this.loginForm.get('userName').value == null ||
            this.loginForm.get('password').value == null ||
            this.loginForm.get('company').value == null) {
            return;
        }

        // this.changeViewOnloggedIn(true);
        // this.router.navigate(['/createdo']);
        // localStorage.setItem('currentUser', 'true');

        this.loginService.login({
            'username': this.loginForm.get('userName').value + '/' + this.loginForm.get('company').value,
            'password': this.loginForm.get('password').value
        }).subscribe(
            (data) => {
                //change the view.
                //navigate to the respective route on the basis of role.
                //set a value in local storage that user is logged in.
                //set the token to storage
                //set the role to storage.
                localStorage.setItem('currentUser', data["role"]);
                localStorage.setItem('token', data["token"]);
                this.changeViewOnloggedIn(true);
                this.router.navigate(['/createdo']);
            },
            (error) => {

            })
    }
}
