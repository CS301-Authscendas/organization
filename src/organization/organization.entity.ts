import { Attribute, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, Entity } from "@typedorm/common";
import { IsArray, IsEnum } from "class-validator";

enum authMethod_enum {
    HOSTED = "HOSTED",
    BANK_SSO = "BANK_SSO",
}

@Entity({
    name: "organization",
    primaryKey: {
        partitionKey: "{{id}}",
    },
})
export class Organization {
    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
    })
    id: string;

    @Attribute()
    name: string;

    @Attribute()
    jwkToken: string;

    @Attribute()
    @IsArray()
    @IsEnum(authMethod_enum)
    authMethod: string[];

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
