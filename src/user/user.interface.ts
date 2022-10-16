export interface I2FAToken {
    expiry: Date;
    token: string;
}

export interface emailDTO {
    email: string;
}

export interface set2FASecretDTO {
    email: string;
    secret: string;
}
