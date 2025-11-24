export interface ApiErrorResponse {
    code: string;
    message: string;
    details: string[];
    timestamp: string;
}

export class ApiError extends Error {
    code: string;
    details: string[];

    constructor(res: ApiErrorResponse) {
        super(res.message);
        this.name = 'ApiError';
        this.code = res.code;
        this.details = res.details;
    }
}
