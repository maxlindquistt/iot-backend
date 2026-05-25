import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { initMqtt } from './mqttHandler.js';
import routes from './routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api', routes);

initMqtt(io);

server.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});
