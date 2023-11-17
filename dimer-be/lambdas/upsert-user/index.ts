import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, context) => {
    console.log('UPSERT USER');

    let updateExpression = "SET lastUpdate = :updateTime";
    let updateAttributes: Record<string, any> = {
        ':updateTime': new Date().toISOString()
    };

    for (let key in event.data) {
        if (key !== 'id') {
            updateExpression += `, ${key} = :${key}`;
            updateAttributes[`:${key}`] = event.data[key];
        }
    }


    const updateItemParams: UpdateCommandInput = {
        TableName: 'DimerUsers',
        Key: {
            id: event.data.id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: updateAttributes,
        ReturnValues: "ALL_NEW"
    };

    console.log(updateItemParams);
    const response = await docClient.send(new UpdateCommand(updateItemParams));
    console.log('RESPONSE: ' + response);
    return response;
};
