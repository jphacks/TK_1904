const LINE_TOKEN = "MI+dz9PXQf+Id39O76SU+0iusKVphAFdAUZyfrdj2cnnrSDnkSN4zTowee0dQjqIXWVLlIkqv6DWENEradLzlNT5tM3pjLxkH4PwiWB3oUxGh1rPDxJVoG7vK6BZit3VgP2OuuW86ICknhx5nWC4EAdB04t89/1O/w1cDnyilFU=";

var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-northeast-1",
});

var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  const client_id = event.client_id;
  const umbrella_id = event.umbrella_id;
  const timestamp = event.timestamp;

  console.log(umbrella_id);

  // get umbrella_data
  var params = {
    TableName: "t_borrows",
    ExpressionAttributeNames: {
      "#umbrella_id": "umbrella_id"
    },
    ExpressionAttributeValues: {
      ":val": umbrella_id
    },
    KeyConditionExpression: '#umbrella_id = :val',
    ScanIndexForward: false,
    Limit: 1
  };
  // where( umbrella_id: umbrella_id).last
  const datas = await dynamo.query(params).promise();
  var data = datas.Items[0];
  console.log(data);

  //update t_borrows
  var borrowParams = {
    TableName: "t_borrows",
    Key: {
      "umbrella_id": data.umbrella_id,
      "started_at": data.started_at
    },
    ExpressionAttributeNames: {
      '#ended_at': 'ended_at'
    },
    ExpressionAttributeValues: {
      ':new_ended_at': timestamp
    },
    UpdateExpression: 'SET #ended_at = :new_ended_at'
  };
  var updated_borrow = await dynamo.update(borrowParams).promise();
  console.log(updated_borrow);

  // update m_umbrellas
  var umbrellaParams = {
    TableName: "m_umbrellas",
    Key: {
      "umbrella_id": data.umbrella_id
    },
    ExpressionAttributeNames: {
      '#location': 'location',
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':location': client_id,
      ':status': 1
    },
    UpdateExpression: 'SET #location = :location, #status = :status'
  };
  var updated_umbrella = await dynamo.update(umbrellaParams).promise();
  console.log(updated_umbrella);

  const user_id = data.user_id;

  var user_params = {
    TableName: 'm_users',
    Key: {
      'user_id': user_id
    }
  };


  const userdata = await dynamo.get(user_params).promise();
  // charge 
  var charge = Math.round((timestamp - data.started_at) / 10000) + 50;
  const balance = userdata.Item.token - charge;

  // update balance
  var userParams = {
    TableName: "m_users",
    Key: {
      "user_id": user_id
    },
    ExpressionAttributeNames: {
      '#token': 'token'
    },
    ExpressionAttributeValues: {
      ':balance': balance
    },
    UpdateExpression: 'SET #token = :balance'
  };
  var updated_umbrella = await dynamo.update(userParams).promise();
  console.log(balance);

  // send reciept
  if (userdata.Item.line_id != null) {
    await sendReciept(Math.round((timestamp - data.started_at) / 60000), Math.round((timestamp - data.started_at) / 10000), 50, balance, user_id, userdata.Item.line_id);
  }

  if (balance < 0) {
    console.log("token is over");
  }

  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('finished'),
  };
  return response;
};

async function sendReciept(use_time, charge_price, standard_price, balance, user_id, line_id) {
  var message = {
    "type": "flex",
    "altText": "This is a Flex Message",
    "contents": {
      "type": "bubble",
      "styles": {
        "footer": {
          "separator": true
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [{
            "type": "text",
            "text": "RECEIPT",
            "weight": "bold",
            "color": "#1DB446",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "Chata Charter",
            "weight": "bold",
            "size": "xxl",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "傘のレンタル代金",
            "size": "xs",
            "color": "#aaaaaa",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "xxl",
            "spacing": "sm",
            "contents": [{
                "type": "box",
                "layout": "horizontal",
                "contents": [{
                    "type": "text",
                    "text": "使用時間",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": use_time.toString() + "分",
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [{
                    "type": "text",
                    "text": "使用料金",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "jpy" + charge_price.toString(),
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [{
                    "type": "text",
                    "text": "基本料金",
                    "size": "sm",
                    "color": "#555555",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "jpy" + standard_price.toString(),
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [{
                    "type": "text",
                    "text": "TOTAL",
                    "size": "sm",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": "jpy" + (charge_price + standard_price).toString(),
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [{
                    "type": "text",
                    "text": "Balance",
                    "size": "sm",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": "jpy" + balance.toString(),
                    "size": "sm",
                    "color": "#111111",
                    "align": "end"
                  }
                ]
              }
            ]
          },
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "margin": "md",
            "contents": [{
                "type": "text",
                "text": "USER ID",
                "size": "xs",
                "color": "#aaaaaa",
                "flex": 0
              },
              {
                "type": "text",
                "text": "#" + user_id,
                "color": "#aaaaaa",
                "size": "xs",
                "align": "end"
              }
            ]
          }
        ]
      }
    }
  };
  console.log("replyLine is started");
  console.log(line_id);
  const request = require('request');
  const url = 'https://api.line.me/v2/bot/message/push';

  await new Promise((resolve, reject) => {
    let options = {
      uri: url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_TOKEN}`,
      },
      json: {
        "to": line_id,
        "messages": [message]
      }
    };
    var res = request.post(options);
  });

}