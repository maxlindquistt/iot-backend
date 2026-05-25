import express from 'express';
import { getHistory } from './db.js';
import { sendCommand } from './mqttHandler.js';

const router = express.Router();

router.get('/history', (req, res) => {
    const data = getHistory(50);
    res.json(data);
});

router.post('/command/led', (req, res) => {
    const { state } = req.body;
    sendCommand(state);
    res.json({ ok: true });
});

export default router;
