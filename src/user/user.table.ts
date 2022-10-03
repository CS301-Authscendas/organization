import { Table, INDEX_TYPE } from "@typedorm/common";

export const userTable = new Table({
    name: "user",
    partitionKey: "id",
});
