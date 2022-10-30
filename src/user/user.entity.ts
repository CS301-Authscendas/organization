import {
    Attribute,
    AutoGenerateAttribute,
    AUTO_GENERATE_ATTRIBUTE_STRATEGY,
    Entity,
    INDEX_TYPE,
} from "@typedorm/common";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, ValidateNested } from "class-validator";
import { Role, STATUS } from "./user.interface";

@Entity({
    name: "user",
    primaryKey: {
        partitionKey: "{{email}}",
    },
    indexes: {
        GSI1: {
            type: INDEX_TYPE.GSI,
            partitionKey: "{{id}}",
            sortKey: "",
        },
    },
})
export class User {
    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
    })
    id: string;

    @Attribute()
    @IsEmail()
    email: string;

    @Attribute()
    password?: string;

    @Attribute()
    firstName: string;

    @Attribute()
    lastName: string;

    @Attribute()
    @IsEnum(STATUS)
    status: string;

    @Attribute()
    birthDate: string;

    @Attribute()
    twoFATokenSecret?: string;

    @Attribute()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Role)
    roles: Role[];

    @Attribute()
    phoneNumber?: string;

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
