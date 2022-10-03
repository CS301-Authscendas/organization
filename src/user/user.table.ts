import {Table, INDEX_TYPE} from '@typedorm/common';

// create table

export const userTable = new Table({
  name: 'user',
  partitionKey: 'id',
//   indexes: {
//     GSI1: {
//       type: INDEX_TYPE.GSI,
//       partitionKey: 'GSI1PK',
//       sortKey: 'GSI1SK',
//     },
//     GSI2: {
//       type: INDEX_TYPE.GSI,
//       partitionKey: 'GSI2PK',
//       sortKey: 'GSI2SK',
//     },
//     LSI1: {
//       type: INDEX_TYPE.LSI,
//       sortKey: 'LSI1SK',
//     },
//   },
});