export interface I2FAToken {
    expiry: Date;
    token: string;
}

export interface EmailDTO {
    email: string;
}

export interface Set2FASecretDTO {
    email: string;
    secret: string;
}
