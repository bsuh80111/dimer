
import { APIGatewayProxyEvent, Handler, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResultV2> = async (event: APIGatewayProxyEvent, context) => {
  console.log('Event: ' + event);

  const { lastEvaluatedUserKey, name } = event.queryStringParameters ?? {};
  let scanParams: ScanCommandInput = {
    TableName: 'DimerUsers',
    Limit: 20
  };

  // Apply user name filter if search string provided
  if (name) {
    scanParams.FilterExpression = 'contains(userNameIndex, :name)';
    scanParams.ExpressionAttributeValues = {
      ':name': name.toLowerCase()
    };
  }

  // Load more results if last scanned key is provided
  if (lastEvaluatedUserKey) {
    scanParams.ExclusiveStartKey = {
      id: lastEvaluatedUserKey
    };
  }

  try {
    const [tableMetadata, users] = await Promise.all([
      // Table Metadata (If searching via name string, we don't need table metadata)
      name ? new Promise<undefined>((resolve) => resolve(undefined)) : docClient.send(
        new GetCommand({
          TableName: 'Metadata',
          Key: { tableName: 'DimerUsers' }
        })
      ),

      // Read users
      docClient.send(new ScanCommand(scanParams))
    ]);

    console.log('Users Table Metadata: ' + tableMetadata);
    console.log('Fetched Users: ' + users);

    return {
      statusCode: 200,
      body: JSON.stringify({
        users: users.Items ?? [],
        lastEvaluatedUserKey: users.LastEvaluatedKey,
        totalUserCount: tableMetadata?.Item?.rowCount
      })
    };
    
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error retrieving users.'
      })
    };
  }
};
