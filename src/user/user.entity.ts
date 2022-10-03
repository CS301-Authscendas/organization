import { Attribute, Entity, AutoGenerateAttribute, INDEX_TYPE } from "@typedorm/common";
import { AUTO_GENERATE_ATTRIBUTE_STRATEGY } from "@typedorm/common";
import { I2FAToken } from "./user.interface";
import { IsEmail, IsNotEmpty, IsEnum} from 'class-validator';

enum status_enum {
    PENDING = "PENDING",
    APPROVED = "APPROVED"
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
    twoFAToken: I2FAToken;

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
