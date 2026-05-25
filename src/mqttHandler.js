import mqtt from 'mqtt';
import { insertReading } from './db.js';

const MQTT_BROKER = 'mqtt://broker.hivemq.com';
const TOPIC_SENSOR = 'lnu/iot/ml227cu/sensor';
const TOPIC_COMMAND = 'lnu/iot/ml227cu/command/led';

let client;

function initMqtt(io) {
    client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(TOPIC_SENSOR);
    });

    client.on('message', (topic, message) => {
        if (topic === TOPIC_SENSOR) {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);
            insertReading(data.value, data.humidity, data.timestamp);
            io.emit('sensor_data', data);
        }
    });
}

function sendCommand(state) {
    client.publish(TOPIC_COMMAND, JSON.stringify({ state }));
}

export { initMqtt, sendCommand };
