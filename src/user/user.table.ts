import { Table } from "@typedorm/common";

export const userTable = new Table({
    name: "user",
    partitionKey: "email",
});
