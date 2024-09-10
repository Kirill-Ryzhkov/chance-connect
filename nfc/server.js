const WebSocket = require('ws');
const { NFC } = require("nfc-pcsc");
const http = require('http');
const express = require('express');
const path = require('path');

const nfc = new NFC();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Keep track of connected clients
const clients = new Set();

wss.on('connection', (socket) => {
    console.log('Client connected');
    clients.add(socket);

    socket.on('close', () => {
        console.log('Client disconnected');
        clients.delete(socket);
    });
});

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} device attached`);

    reader.on('card', card => {
        console.log(`${reader.reader.name} card detected`, card.uid);
        for (const client of clients) {
            client.send('cardID:' + card.uid);
        }
    });

    reader.on('card.off', card => {
        for (const client of clients) {
            client.send('card - ' + card.uid + ' has removed');
        }
    });

    reader.on('error', err => {
        console.error(`${reader.reader.name} an error occurred`, err);
        for (const client of clients) {
            client.send('You have some errors - ' + err);
        }
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name} device removed`);
        for (const client of clients) {
            client.send('reader device removed. Goodbye!');
        }
    });
});

nfc.on('error', err => {
    console.error('NFC error', err);
});

const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

