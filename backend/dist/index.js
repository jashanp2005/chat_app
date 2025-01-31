"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
;
let sockets = [];
wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        // message toh string me hi aayega
        // check karo message kya hai
        // @ts-ignore
        const msg = JSON.parse(message);
        if (msg.type === 'join') {
            sockets.push({
                socket,
                room: msg.payload.roomId,
            });
        }
        if (msg.type === 'chat') {
            let currentRoomId = null;
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].socket === socket) {
                    currentRoomId = sockets[i].room;
                    break;
                }
            }
            for (let i = 0; i < sockets.length; i++) {
                if (sockets[i].room === currentRoomId) {
                    sockets[i].socket.send(msg.payload.message);
                }
            }
        }
    });
});
