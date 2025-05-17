import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService, Request } from './request.service';
import { AlertService } from '@app/_services';
import { AccountService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-request-list',
    templateUrl: './request-list.component.html'
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    loading = false;
    selectedRequest: Request | null = null;
    approvalComments: string = '';
    rejectionReason: string = '';
    showApproveModal = false;
    showRejectModal = false;
    submitting = false;
    
    constructor(
        private requestService: RequestService,
        private alertService: AlertService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Check if user is logged in and has admin role
        const account = this.accountService.accountValue;
        if (!account) {
            this.alertService.error('You must be logged in to view requests');
            this.router.navigate(['/account/login']);
            return;
        }

        if (account.role !== 'Admin') {
            this.alertService.error('You must have admin privileges to view requests');
            this.router.navigate(['/']);
            return;
        }

        this.loading = true;
        this.loadRequests();
    }

    loadRequests() {
        console.log('Loading requests...');
        this.alertService.clear();
        
        this.requestService.getAll().pipe(first()).subscribe({
            next: (requests) => {
                console.log('Requests loaded successfully:', requests);
                this.requests = requests;
                this.loading = false;
                
                if (requests.length === 0) {
                    console.log('No requests found');
                }
            },
            error: (error) => {
                console.error('Error loading requests:', error);
                this.alertService.error('Failed to load requests: ' + (error.message || 'Unknown error'));
                this.loading = false;
            }
        });
    }

    viewDetails(id: number) {
        this.router.navigate(['edit', id], { relativeTo: this.route });
    }

    openApproveModal(request: Request) {
        this.selectedRequest = request;
        this.approvalComments = '';
        this.showApproveModal = true;
    }

    openRejectModal(request: Request) {
        this.selectedRequest = request;
        this.rejectionReason = '';
        this.showRejectModal = true;
    }

    cancelModal() {
        this.showApproveModal = false;
        this.showRejectModal = false;
        this.selectedRequest = null;
    }

    approveRequest() {
        if (!this.selectedRequest) return;
        
        this.submitting = true;
        this.requestService.approve(this.selectedRequest.id, this.approvalComments)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request approved successfully');
                    this.loadRequests();
                    this.showApproveModal = false;
                    this.submitting = false;
                },
                error: (error) => {
                    console.error('Error approving request:', error);
                    this.alertService.error('Failed to approve request: ' + (error.message || 'Unknown error'));
                    this.submitting = false;
                }
            });
    }

    rejectRequest() {
        if (!this.selectedRequest || !this.rejectionReason) return;
        
        this.submitting = true;
        this.requestService.reject(this.selectedRequest.id, this.rejectionReason)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request rejected successfully');
                    this.loadRequests();
                    this.showRejectModal = false;
                    this.submitting = false;
                },
                error: (error) => {
                    console.error('Error rejecting request:', error);
                    this.alertService.error('Failed to reject request: ' + (error.message || 'Unknown error'));
                    this.submitting = false;
                }
            });
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'approved': return 'status-success';
            case 'rejected': return 'status-danger';
            case 'pending': return 'status-warning';
            default: return 'status-info';
        }
    }
} 