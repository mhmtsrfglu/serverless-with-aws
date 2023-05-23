import {
  BillingMode,
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
  GetItemCommand,
  DeleteItemCommand
} from "@aws-sdk/client-dynamodb";

import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

describe("DynamoDb Table", () => {
  const tableName = "TestTable";
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const deleteTableCommand = new DeleteTableCommand({ TableName: tableName });
  const items: string[] = ["Item1", "Item2", "Item3"];

  const primaryKey = [{ AttributeName: "Name", AttributeType: "S" }];

  beforeAll(async () => {
    const createTableCommand = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: primaryKey,
      KeySchema: [
        {
          AttributeName: primaryKey[0].AttributeName,
          KeyType: "HASH",
        },
        ...(primaryKey[1]
          ? [
              {
                AttributeName: primaryKey[1].AttributeName,
                KeyType: "RANGE",
              },
            ]
          : []),
      ],
      BillingMode: BillingMode.PAY_PER_REQUEST,
    });

    await client.send(createTableCommand);
    await waitUntilTableExists(
      { client, maxWaitTime: 180 },
      { TableName: tableName }
    );
  });

  test("should add the requested item to table", async () => {
    if (items.length) {
      for (const item of items) {
        const params = {
          TableName: tableName,
          Item: {
            Name: { S: item },
          },
        };

        await client.send(new PutItemCommand(params));
      }
    }
  });

  test("should return the requested item", async () => {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        Name: { S: "Item2" },
      },
    });
  
    const {Item} = await client.send(command);
    expect(Item?.Name.S).toEqual("Item2");
  });

  test("should remove an item from a database", async () => {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        Name: "Item2",
      },
    });

    const deleteCommand = new DeleteItemCommand({
      TableName: tableName,
      Key: {
        Name: { S: "Item2" },
      },
    });

    const before = await docClient.send(getCommand);
    expect(before.Item).toBeDefined();
  

    await client.send(deleteCommand);

    const after = await docClient.send(getCommand);

    expect(after.Item).toBeUndefined();
  });

  afterAll(() => client.send(deleteTableCommand));
});
