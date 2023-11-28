import { APIGatewayProxyEvent, Handler, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DeleteCommandInput, DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResultV2> = async (event: APIGatewayProxyEvent, context) => {
  console.log('Event: ' + JSON.stringify(event));

  const { id } = event.pathParameters ?? {};

  // If no ID, return error
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No user ID provided.'
      })
    };
  }

  try {
    const deleteUserParams: DeleteCommandInput = {
      TableName: 'DimerUsers',
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };

    const deleteUserResult = await docClient.send(new DeleteCommand(deleteUserParams));

    // If nothing was deleted, return error
    if (!deleteUserResult.Attributes) {
      console.log(`No user with ID ${id}.`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `No user with ID ${id}.`
        })
      };
    }

    // Delete succeeded -- update metadata table
    const metadataUpdateParams: UpdateCommandInput = {
      TableName: 'Metadata',
      Key: { tableName: 'DimerUsers' },
      UpdateExpression: 'SET lastOperationTime = :operationTime, rowCount = rowCount - :subtract',
      ExpressionAttributeValues: {
        ':operationTime': new Date().toISOString(),
        ':subtract': 1
      },
      ReturnValues: 'ALL_NEW'
    }

    const metadataResponse = await docClient.send(new UpdateCommand(metadataUpdateParams));
    console.log(deleteUserResult, metadataResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Deleted user ${id}.`,
        deletedUser: deleteUserResult.Attributes,
        totalUserCount: metadataResponse.Attributes?.rowCount
      })
    };

  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error deleting user.'
      })
    };
  }
};
