import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { LoginService } from '../../services/login.service'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    //   styleUrls: ['./app-raise-bill.css']
})
export class LoginComponent implements OnInit {

    constructor(private fb: FormBuilder, private loginService: LoginService,
        private router: Router,private toaster:ToastrService) { }

    ngOnInit() {
      this.loginService.getCompanies().subscribe(
        (res) => {
          if(res.success){
            this.companies = res.data;
          }else{
            this.toaster.error(res.message);
          }
        }
      )
    }

    @Output() showsidebar = new EventEmitter<any>();
    companies:Array<any>;
    loginForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required],
        company: ['', Validators.required]
    })

    changeViewOnloggedIn(status) {
        this.showsidebar.emit(status);
    }

    isloggedIn() {
        return localStorage.getItem('isLogin');
    }

    submitLogin() {
        if (this.loginForm.invalid) {
          this.toaster.error("All fields are mandatory for login");
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
                localStorage.setItem('currentRole', data["role"]);
                localStorage.setItem('token', data["token"]);
                this.changeViewOnloggedIn(true);
                this.router.navigate(['/do']);
            },
            () => {
                this.toaster.error("Please check your username and password","wrong UserName password error",{
                    timeOut: 5000
                  });

            })
    }
}
