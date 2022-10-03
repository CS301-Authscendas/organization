import { Attribute, Entity, AutoGenerateAttribute, INDEX_TYPE } from "@typedorm/common";
import { AUTO_GENERATE_ATTRIBUTE_STRATEGY } from "@typedorm/common";
import { I2FAToken } from "./user.interface";

@Entity({
    name: "user",
    primaryKey: {
        partitionKey: "USER#{{id}}",
    },
})
export class User {
    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
    })
    id: string;

    @Attribute()
    organizationId: string[];

    @Attribute()
    email: string;

    @Attribute()
    firstName: string;

    @Attribute()
    lastName: string;

    @Attribute()
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
