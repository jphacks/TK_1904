# -*- coding: UTF-8 -*-
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import sys
import logging
import time
import argparse
import json

CLIENT_ID = "hongo"
ENDPOINT = "a2t2kzsiop86f2-ats.iot.ap-northeast-1.amazonaws.com"
# MQTTでは、標準で1883/TCPポート 
# SSL（TLS）による暗号化を行う場合には8883/TCPポートを使用。 
PORT = 8883
ROOT_CA = "./cert/amazon-root-ca.pem"
PRIVATE_KEY = "./cert/08f526afe3-private.pem.key"
CERTIFICATE = "./cert/08f526afe3-certificate.pem.crt"

TOPIC_send = "JPHACK/checkUser"
TOPIC_recv = "JPHACK/recvUserValidation"



def main():
    # https://s3.amazonaws.com/aws-iot-device-sdk-python-docs/sphinx/html/index.html
    # setting for MQTT
    client = AWSIoTMQTTClient(CLIENT_ID)
    client.configureEndpoint(ENDPOINT, PORT)
    client.configureCredentials(ROOT_CA, PRIVATE_KEY, CERTIFICATE)
    # AWSIoTMQTTClient connection configuration
    client.configureAutoReconnectBackoffTime(1, 32, 20)
    # -1:infinite
    client.configureOfflinePublishQueueing(-1)
    # Draining: 2 Hz
    client.configureDrainingFrequency(2)
    # 10 sec
    client.configureConnectDisconnectTimeout(10)
    # 5 sec
    client.configureMQTTOperationTimeout(5)
    # Connect to AWS IoT with default keepalive set to 600 seconds 
    # keepAliveIntervalSecond : Time in seconds for interval of sending MQTT ping request. Default set to 600 seconds.
    client.connect()
    # TOPICが起動したら呼ばれる関数を登録するQoS(Quality of Service)=1
    # QoS=0:投げっぱなし,QoS=1:少なくとも1回は確実にBrokerにメッセージが届く
    client.subscribe(TOPIC_recv, 1, mycallback)
    checkUser(sys.argv[1])
#    time.sleep(5)
    time.sleep(10)

def mycallback(client, userdata, message):
    payload = json.loads(message.payload)
    validate = payload['validate']
    if validate:
        # ロックを解除する
        print("true")
    else:
        print("false")

def checkUser(user_id):

    client = AWSIoTMQTTClient(CLIENT_ID)
    client.configureEndpoint(ENDPOINT, PORT)
    client.configureCredentials(ROOT_CA, PRIVATE_KEY, CERTIFICATE)

    # AWSIoTMQTTClient connection configuration
    client.configureAutoReconnectBackoffTime(1, 32, 20)
    client.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
    client.configureDrainingFrequency(2)  # Draining: 2 Hz
    client.configureConnectDisconnectTimeout(10)  # 10 sec
    client.configureMQTTOperationTimeout(5)  # 5 sec

    # publish usre_id
    client.connect()
    message = {}
    message['user_id'] = str(user_id)
    messageJson = json.dumps(message)
    client.publish(TOPIC_send, messageJson, 1)


if __name__ == "__main__":
    main()

