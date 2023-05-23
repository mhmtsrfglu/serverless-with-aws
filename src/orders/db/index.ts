import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const dynamo = new DynamoDBClient({});

export default DynamoDBDocumentClient.from(dynamo);