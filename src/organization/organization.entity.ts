import { Attribute, AutoGenerateAttribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, Entity } from "@typedorm/common";
import { IsArray } from "class-validator";

@Entity({
    name: "organization",
    primaryKey: {
        partitionKey: "{{id}}",
    },
})
export class Organization {
    @Attribute()
    id: string;

    @Attribute()
    name: string;

    @Attribute()
    jwkToken: string;

    @Attribute()
    @IsArray()
    authMethod: string[];

    @AutoGenerateAttribute({
        strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
        autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
    })
    updatedAt: number;
}
