import { DocumentClient as DynamoClient } from 'aws-sdk/clients/dynamodb';
import { Table } from 'dynamodb-toolbox';

const DocumentClient = new DynamoClient();

export const TestTable = new Table({
  name: process.env.TEST_TABLE!,
  partitionKey: 'pk',
  DocumentClient,
});
