const express = require('express');
const router = express.Router();
const { getHistory } = require('./db');
const { sendCommand } = require('./mqttHandler');

router.get('/history', (req, res) => {
    const data = getHistory(50);
    res.json(data);
});

router.post('/command/led', (req, res) => {
    const { state } = req.body;
    sendCommand(state);
    res.json({ ok: true });
});

module.exports = router;