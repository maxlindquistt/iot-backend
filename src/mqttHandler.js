import mqtt from 'mqtt';
import { insertReading } from './db.js';

const TOPIC_SENSOR = 'lnu/iot/ml227cu/sensor';
const TOPIC_COMMAND = 'lnu/iot/ml227cu/command/led';

let client;

function initMqtt(io) {
    client = mqtt.connect('mqtts://f88eef6f2b6e40b39987e53cd1236bf5.s1.eu.hivemq.cloud:8883', {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        rejectUnauthorized: true
    });

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(TOPIC_SENSOR);
    });

    client.on('message', (topic, message) => {
        if (topic === TOPIC_SENSOR) {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);
            const created_at = insertReading(data.value, data.humidity, data.timestamp);
            io.emit('sensor_data', { ...data, created_at });
        }
    });

    client.on('error', (err) => {
        console.error('MQTT error:', err.message);
    });
}

function sendCommand(state) {
    client.publish(TOPIC_COMMAND, JSON.stringify({ state }));
}

export { initMqtt, sendCommand };