import { Entity } from 'dynamodb-toolbox';

import { TestTable } from './table';

interface UserSchema {
  pk: string;
  username: string;
}

export const User = new Entity<UserSchema>({
  name: 'User',
  attributes: {
    pk: {
      partitionKey: true,
      required: true,
      hidden: true,
      prefix: 'USER#',
      default: (data: UserSchema) => data.username.toLowerCase(),
    },
    username: { type: 'string', required: true },
  },

  table: TestTable,
});
