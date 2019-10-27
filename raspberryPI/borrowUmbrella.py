# -*- coding: UTF-8 -*-
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import sys
import logging
import time
import argparse
import json
import codecs

CLIENT_ID = "hongo"
ENDPOINT = "a2t2kzsiop86f2-ats.iot.ap-northeast-1.amazonaws.com"
# MQTTでは、標準で1883/TCPポート 
# SSL（TLS）による暗号化を行う場合には8883/TCPポートを使用。 
PORT = 8883
ROOT_CA = "./cert/amazon-root-ca.pem"
PRIVATE_KEY = "./cert/08f526afe3-private.pem.key"
CERTIFICATE = "./cert/08f526afe3-certificate.pem.crt"

TOPIC = "JPHACK/borrowUmbrella"

# python borrowUmbrella.py user_id umbrella_id
def main():
    user_id = sys.argv[1]
    umbrella_id = sys.argv[2]

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
    message['user_id'] = user_id
    message['umbrella_id'] = umbrella_id
    messageJson = json.dumps(message)
    client.publish(TOPIC, messageJson, 1)

if __name__ == "__main__":
    main()

