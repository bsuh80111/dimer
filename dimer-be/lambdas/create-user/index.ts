import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
    console.log('HELLO CREATE USER TEST 2:\n' + JSON.stringify(event, null, 2));
    return context.logStreamName;
};
