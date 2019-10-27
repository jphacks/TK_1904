const LINE_TOKEN = "MI+dz9PXQf+Id39O76SU+0iusKVphAFdAUZyfrdj2cnnrSDnkSN4zTowee0dQjqIXWVLlIkqv6DWENEradLzlNT5tM3pjLxkH4PwiWB3oUxGh1rPDxJVoG7vK6BZit3VgP2OuuW86ICknhx5nWC4EAdB04t89/1O/w1cDnyilFU=";

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'ap-northeast-1'
});

exports.handler = async (event, context, callback) => {
    console.log(event);

    const botid = event.destination;
    const reqtext = event.events[0].message.text;
    const reptoken = event.events[0].replyToken;
    const line_id = event.events[0].source.userId;

    console.log(botid);
    console.log(reqtext);
    console.log(reptoken);
    console.log("line_id: ", line_id);

    let resStr = '';

    if (reptoken == '00000000000000000000000000000000') {
        context.succeed(createResponse(200, 'Completed successfully !!'));
        console.log("Success: Response completed successfully !!");
    } else {
        if (botid == 'U45b67cdacf8c284619ada5301db5254a') {
            console.log("botid is OK");
            var status = await checkUser(reqtext, line_id);
            console.log("status: ", status)
            switch (status) {
                case "invalid":
                    console.log("invalid");
                    return replyLine(reptoken, "ユーザーが存在しません").then(() => {
                        context.succeed(createResponse(200, 'Completed successfully !!'));
                    });
                case "valid":
                    console.log("valid");
                    return replyLine(reptoken, "ラインを登録しました。").then(() => {
                        context.succeed(createResponse(200, 'Completed successfully !!'));
                    });
                case "no-token":
                    console.log("no-token");
                    return replyLine(reptoken, "ラインを登録しました。").then(() => {
                        context.succeed(createResponse(200, 'Completed successfully !!'));
                    });
                    // 決済機能
            }
        } else {
            context.succeed(createResponse(500, 'There is no corresponding process ...'));
        }
    }
};

const createResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify(body)
    };
};

function replyLine(reptoken, resStr) {
    console.log("replyLine is started");
    return new Promise((resolve, reject) => {
        const request = require('request');
        const url = 'https://api.line.me/v2/bot/message/reply';

        let options = {
            uri: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${LINE_TOKEN}`,
            },
            json: {
                "replyToken": reptoken,
                "messages": [{
                    "type": "text",
                    "text": resStr
                }]
            }
        };
        request.post(options, function (error, response, body) {
            if (!error) {
                console.log('Success: Communication successful completion !!');
                console.log(body);
                resolve();
            } else {
                console.log(`Failed: ${error}`);
                resolve();
            }
        });
    });
}

async function checkUser(user_id, line_id) {
    var params = {
        TableName: 'm_users',
        Key: {
            'user_id': user_id
        }
    };

    const data = await dynamo.get(params).promise();
    console.log(data.Item);
    if (data == {}) {
        return "invalid";
    } else {
        if (data.Item.line_id == 1) {
            // update balance
            var userParams = {
                TableName: "m_users",
                Key: {
                    "user_id": user_id
                },
                ExpressionAttributeNames: {
                    '#line_id': 'line_id'
                },
                ExpressionAttributeValues: {
                    ':line_id': line_id
                },
                UpdateExpression: 'SET #line_id = :line_id'
            };
            var updated_user = await dynamo.update(userParams).promise();
        }
        if (data.Item.token <= 0) {
            return "no-token";
        } else {
            return "valid";
        }
    }
}