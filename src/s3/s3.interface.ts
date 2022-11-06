export interface IS3File {
    name: string;
    data: unknown[];
}

export interface HostedSeededParamsDTO {
    id: string;
    name: string;
    email: string;
}

export interface SSOSeededParamsDTO {
    organizationId: string;
    name: string;
    email: string;
}
