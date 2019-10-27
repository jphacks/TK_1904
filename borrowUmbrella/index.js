var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'ap-northeast-1'
});

exports.handler = async (event) => {
    console.log(event);
    // convert data
    const user_id = event.user_id;
    const umbrella_id = event.umbrella_id;
    const started_at = event.timestamp;

    // put borrow data
    const db_response = await dynamo.put({
        TableName: 't_borrows',
        Item: {
            umbrella_id: umbrella_id,
            user_id: user_id,
            started_at: started_at
        }
    }).promise();
    console.log(db_response);

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(db_response),
    };
    return response;
};