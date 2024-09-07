const WebSocket = require('ws');
const { NFC } = require("nfc-pcsc");
const http = require('http');
const express = require('express');
const path = require('path');

const nfc = new NFC();
const app = express();
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

nfc.on('reader', reader => {
    // wss.on('connection', (socket) => {

    //     socket.send('Добро пожаловать NFC!');
    //     socket.send(`${reader.reader.name}  device attached\n`);

        reader.on('card', card => {
            console.log(`${reader.reader.name}  card detected\n`, card.uid);
            // socket.send('cardID:' + card.uid);
        });

        reader.on('card.off', card => {
            // socket.send('card - ' + card.uid + ' has removed');
        });

        reader.on('error', err => {
            console.log(`${reader.reader.name}  an error occurred\n`, err);
            // socket.send('You have some errors - ' + err);
        });

        reader.on('end', () => {
            console.log(`${reader.reader.name}  device removed\n`);
            // socket.send('reader device removed. Goodbye!');
        });

    //     socket.on('close', () => {
    //         console.log('Client disconnected');
    //     });
    // });
});



const PORT = process.env.PORT || 2000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

