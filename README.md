Install deps
```bash
npm install
cd lambda
npm install
```

Run localstack
```bash
DEBUG=1 SERVICES=serverless,lambda,appsync,dynamodb localstack start
```

Deploy the stack
```bash
npm run cdklocal bootstrap
npm run cdklocal deploy
```

Make a gql request:

```gql
mutation TestMutation {
  createUser(username: "testUser") {
    username
  }
}
```

```gql
query TestQuery {
  getUser(username: "testUser") {
    username
  }
}
```

This one with VTL works
```gql
query TestQuery {
  getOne(username: "USER#testUser") {
    username
  }
}
```

