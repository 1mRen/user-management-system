import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: UntypedFormGroup;
    loading = false;
    submitted = false;
    isVerificationError = false;
    userEmail = '';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; } 

    onSubmit() {
        this.submitted = true;
        this.isVerificationError = false;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.userEmail = this.f['email'].value;
        
        this.accountService.login(this.userEmail, this.f['password'].value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    // Check if this is a verification error
                    if (error === 'Please verify your email before logging in') {
                        this.isVerificationError = true;
                    }
                    
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    
    resendVerificationEmail() {
        this.loading = true;
        this.accountService.resendVerificationEmail(this.userEmail)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Verification email sent, please check your inbox');
                    this.loading = false;
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}