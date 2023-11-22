import { APIGatewayProxyEvent, Handler, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResultV2> = async (event: APIGatewayProxyEvent, context) => {
    console.log('Event: ' + event);

    // Error if no body/data is provided
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No data provided'
            })
        }
    }

    const data = JSON.parse(event.body); // Parse data
    const userId = data.id ?? randomUUID(); // Generate new ID if none provided
    const updateTime = new Date().toISOString();

    // Set update timestamp
    let updateExpression = 'SET lastUpdate = :updateTime';
    let updateAttributes: Record<string, any> = {
        ':updateTime': updateTime
    };

    // Iterate through data keys to create update expression
    // Allows us to upsert data
    // Idea from https://dev.to/dengel29/flexible-upsert-with-dynamodb-397j
    for (let key in data) {
        if (key !== 'id') {
            updateExpression += `, ${key} = :${key}`;
            updateAttributes[`:${key}`] = data[key];
        }
    }

    // If userName is being updated, update the search index
    if (data['userName']) {
        updateExpression += `, userNameIndex = :userNameIndex`;
        updateAttributes[':userNameIndex'] = (data['userName'] as string).toLowerCase();
    }

    // Initialize update parameters
    const updateItemParams: UpdateCommandInput = {
        TableName: 'DimerUsers',
        Key: { id: userId }, // Primary Key
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: updateAttributes,
        ReturnValues: 'ALL_NEW' // Returns all properties of the modified/inserted item
    };
    console.log(updateItemParams);

    // Execute update
    const response = await docClient.send(new UpdateCommand(updateItemParams));


    // Table metadata update
    let metadataUpdateExpression = 'SET lastOperationTime = :operationTime';
    let metadataUpdateAttributes: Record<string, any> = {
        ':operationTime': updateTime
    };

    // If user was inserted, update the table's row count metadata
    if (!data.id) {
        metadataUpdateExpression += ', rowCount = if_not_exists(rowCount, :initial) + :add';
        metadataUpdateAttributes[':initial'] = 0;
        metadataUpdateAttributes[':add'] = 1;
    }

    const metadataResponse = await docClient.send(
        new UpdateCommand({
            TableName: 'Metadata',
            Key: { tableName: 'DimerUsers' },
            UpdateExpression: metadataUpdateExpression,
            ExpressionAttributeValues: metadataUpdateAttributes,
            ReturnValues: 'ALL_NEW'
        })
    );
    console.log(metadataResponse);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: data.id ? `Updated user: ${userId}` : `Inserted user: ${userId}`,
            result: response.Attributes
        })
    };
};
