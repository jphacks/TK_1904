var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'ap-northeast-1'
});

const endpoint = 'a2t2kzsiop86f2-ats.iot.ap-northeast-1.amazonaws.com';
const topic = "JPHACK/recvUserValidation"
const region = 'ap-northeast-1';

var iotdata = new AWS.IotData({
    endpoint: endpoint,
    region: region
});

exports.handler = async (event) => {
    console.log(event);

    const user_id = event.user_id;
    console.log(user_id);

    var params = {
        TableName: 'm_users',
        Key: {
            'user_id': user_id
        }
    };

    const data = await dynamo.get(params).promise();
    console.log(data.Item);
    var payload = {
        "validate": validation(data.Item)
    };
    var iot_params = {
        topic: topic,
        payload: JSON.stringify(payload),
        qos: 0
    };
    sleep(1000);

    let result = await iotdata.publish(iot_params).promise();

    console.log(iotdata);
};

function validation(user) {
    if (user.status == "active" && user.borrow_status == 1) {
        return true
    } else {
        return false
    }
}

function sleep(waitMsec) {
    var startMsec = new Date();

    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
}