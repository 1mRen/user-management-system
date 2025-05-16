import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from "@angular/forms";
import { first } from "rxjs/operators";

import { AccountService, AlertService } from "@app/_services";
import { MustMatch } from "@app/_helpers";
import { Account } from "@app/_models";

@Component({ templateUrl: "add-edit.component.html" })
export class AddEditComponent implements OnInit {
	form: UntypedFormGroup;
	id: string;
	isAddMode: boolean;
	loading = false;
	submitted = false;
	account: Account;
	isAdmin = false;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private alertService: AlertService
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.params["id"];
		this.isAddMode = !this.id;

		this.form = this.formBuilder.group(
			{
				title: ["", Validators.required],
				firstName: ["", Validators.required],
				lastName: ["", Validators.required],
				email: ["", [Validators.required, Validators.email]],
				role: ["", Validators.required],
				isActive: [true],
				password: [
					"",
					[
						Validators.minLength(6),
						this.isAddMode ? Validators.required : Validators.nullValidator,
					],
				],
				confirmPassword: [""],
			},
			{
				validator: MustMatch("password", "confirmPassword"),
			}
		);

		if (!this.isAddMode) {
			this.accountService
				.getById(this.id)
				.pipe(first())
				.subscribe((account) => {
					this.account = account;
					this.isAdmin = account.role === 'Admin';
					this.form.patchValue(account);
				});
		}
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.form.controls;
	}

	onSubmit() {
		this.submitted = true;

		// reset alerts on submit
		this.alertService.clear();

		// stop here if form is invalid
		if (this.form.invalid) {
			return;
		}

		this.loading = true;
		if (this.isAddMode) {
			this.createAccount();
		} else {
			this.updateAccount();
		}
	}

	toggleStatus() {
		if (!this.account || this.isAdmin) return;
		
		const newStatus = !this.account.isActive;
		this.loading = true;
		
		this.accountService
			.updateStatus(this.id, newStatus)
			.pipe(first())
			.subscribe({
				next: () => {
					this.account.isActive = newStatus;
					this.form.patchValue({ isActive: newStatus });
					this.alertService.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`, {
						keepAfterRouteChange: true,
					});
					this.loading = false;
				},
				error: (error) => {
					this.alertService.error(`Failed to ${newStatus ? 'activate' : 'deactivate'} account`);
					this.loading = false;
				},
			});
	}

	private createAccount() {
		this.accountService
			.create(this.form.value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.alertService.success("Account created successfully", {
						keepAfterRouteChange: true,
					});
					this.router.navigate(["../"], { relativeTo: this.route });
				},
				error: (error) => {
					this.alertService.error(error);
					this.loading = false;
				},
			});
	}

	private updateAccount() {
		this.accountService
			.update(this.id, this.form.value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.alertService.success("Update successful", {
						keepAfterRouteChange: true,
					});
					this.router.navigate(["../"], { relativeTo: this.route });
				},
				error: (error) => {
					this.alertService.error(error);
					this.loading = false;
				},
			});
	}
}
