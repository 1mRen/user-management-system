import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => new Promise(resolve => {
        // Check if we have a stored account from localStorage
        const account = accountService.accountValue;
        
        if (!account || !account.jwtToken) {
            console.log('No stored account found during app initialization');
            return resolve(true);
        }
        
        console.log('Attempting to refresh token on app startup');
        
        // Attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe({
                next: () => {
                    console.log('Token refreshed successfully during app initialization');
                    resolve(true);
                },
                error: (error) => {
                    console.error('Token refresh failed during app initialization:', error);
                    // Don't navigate here, let the auth guard handle it
                    resolve(true);
                }
            });
    });
}


