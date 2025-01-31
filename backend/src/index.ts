import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({port: 8000});

interface User {
    socket: WebSocket,
    room: String,
};

let sockets: User[] = [];

wss.on('connection', (socket) => {

    socket.on('message', (message) => {

        // @ts-ignore
        const msg = JSON.parse(message);

        if(msg.type === 'join'){
            sockets.push({
                socket,
                room: msg.payload.roomId,
            })
        }

        if(msg.type === 'chat'){

            let currentRoomId = null;
            for(let i=0; i<sockets.length; i++){
                if(sockets[i].socket === socket){
                    currentRoomId = sockets[i].room;
                    break;
                }
            }

            for(let i=0; i<sockets.length; i++){
                if(sockets[i].room === currentRoomId){
                    sockets[i].socket.send(msg.payload.message);
                }
            }
        }

    })
})