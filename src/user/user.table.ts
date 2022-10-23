import { INDEX_TYPE, Table } from "@typedorm/common";

export const userTable = new Table({
    name: "user",
    partitionKey: "email",
    indexes: {
        GSI1: {
            type: INDEX_TYPE.GSI,
            partitionKey: "id",
            sortKey: "",
        },
    },
});
