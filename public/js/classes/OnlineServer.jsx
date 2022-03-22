const socket = new WebSocket('ws://localhost:8082');

socket.onopen = () => {
    console.log('Connected');
    socket.send(JSON.stringify({PAYLOAD: 1, d: localStorage.token}));
}

socket.onmessage = (data) => {
    console.log('Message received');
}

export default class OnlineServer {
    static getSocket () {
        return socket;
    }
}