import { Table } from "@typedorm/common";

export const organizationTable = new Table({
    name: "organization",
    partitionKey: "id",
});
