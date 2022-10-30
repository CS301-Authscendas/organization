import { Attribute } from "@typedorm/common";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export interface I2FAToken {
    expiry: Date;
    token: string;
}

export interface EmailDTO {
    email: string;
}

export interface Set2FASecretDTO {
    email: string;
    secret: TwoFATokenObj;
}

export enum STATUS {
    PENDING = "pending",
    APPROVED = "approved",
}

export enum UserScopes {
    AdminDelete = "admin-delete",
    AdminWrite = "admin-write",
    AdminRead = "admin-read",
    User = "user",
}

// export enum PERMISSIONS {
//     USER = "user",
//     ADMIN_READ = "admin-read",
//     ADMIN_WRITE = "admin-write",
//     ADMIN_DELETE = "admin-delete",
// }

export class Role {
    @IsString()
    organizationId: string;

    @Attribute()
    @IsEnum(UserScopes, { each: true })
    // @ValidateNested({ each: true })
    // @IsArray()
    // @Type()
    @IsNotEmpty()
    permission: UserScopes[];
}

export class TwoFATokenObj {
    @IsString()
    token: string;

    @IsNumber()
    creationDate: number;
}
