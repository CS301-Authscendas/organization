import { Attribute, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, Entity } from "@typedorm/common";
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export enum STATUS {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
}

export enum ROLES {
    ADMIN = "ADMIN",
    OWNER = "OWNER",
    USER = "USER",
}

@Entity({
    name: "user",
    primaryKey: {
        partitionKey: "{{email}}",
    },
})
export class User {
    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
    })
    id: string;

    @Attribute()
    @IsNotEmpty()
    organizationId: string[];

    @Attribute()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @Attribute()
    firstName: string;

    @Attribute()
    lastName: string;

    @Attribute()
    @IsEnum(STATUS)
    status: string;

    @Attribute()
    birthDate: Date;

    @Attribute()
    twoFATokenSecret: string | null;

    @Attribute()
    @IsEnum(ROLES)
    role: string;

    @Attribute()
    @IsString()
    @IsPhoneNumber("SG")
    phoneNumber: string | null;

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
