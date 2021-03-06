import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { join } from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'project-01-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    const testLambda = new NodejsFunction(this, 'AppSyncHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: join(__dirname, '..', 'lambda/index.ts'),
      memorySize: 1024,
      tracing: lambda.Tracing.PASS_THROUGH,
      bundling: { minify: true },
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDataSource = api.addLambdaDataSource(
      'lambdaDatasource',
      testLambda
    );

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getUser',
    });

    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createUser',
    });

    const testTable = new dynamo.Table(this, 'TestTable', {
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: dynamo.AttributeType.STRING,
      },
    });

    // Testing vtl
    const dynamoDS = api.addDynamoDbDataSource('dynamoDataSource', testTable);

    dynamoDS.createResolver({
      typeName: 'Query',
      fieldName: 'getOne',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
        'pk',
        'username'
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    testTable.grantFullAccess(testLambda);
    testLambda.addEnvironment('TEST_TABLE', testTable.tableName);

    new cdk.CfnOutput(this, 'x-api-key', {
      value: api.apiKey || '',
    });
  }
}
