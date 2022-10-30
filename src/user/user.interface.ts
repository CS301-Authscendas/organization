import { Attribute } from "@typedorm/common";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

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

export enum STATUS {
    PENDING = "pending",
    APPROVED = "approved",
}

export enum PERMISSIONS {
    USER = "user",
    ADMIN_READ = "admin-read",
    ADMIN_WRITE = "admin-write",
    ADMIN_DELETE = "admin-delete",
}

export class Role {
    @IsString()
    organizationId: string;

    @Attribute()
    @IsEnum(PERMISSIONS)
    @IsNotEmpty()
    permission: PERMISSIONS;
}
