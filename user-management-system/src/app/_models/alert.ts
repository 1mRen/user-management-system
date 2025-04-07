export class Alert {
    id?: string;
    type: AlertType;
    message: string;
    autoClose: boolean;
    keepAfterRouteChange?: boolean;
    fade: boolean;

    constructor(init?: Partial<Alert>) {
        this.id = init?.id;
        this.type = init?.type || AlertType.Info;
        this.message = init?.message || '';
        this.autoClose = init?.autoClose || false;
        this.keepAfterRouteChange = init?.keepAfterRouteChange || false;
        this.fade = init?.fade || false;
    }
}

export enum AlertType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}
