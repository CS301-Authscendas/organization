import { Attribute, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, Entity } from "@typedorm/common";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

enum status_enum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
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

    @Attribute()
    firstName: string;

    @Attribute()
    lastName: string;

    @Attribute()
    @IsEnum(status_enum)
    status: string;

    @Attribute()
    birthDate: Date;

    @Attribute()
    @IsString()
    twoFATokenSecret: string;

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
