const { v4: uuidv4 } = require('uuid');
const socket = require('socket');

const createStream = () => {
    const roomId = uuidv4();
    socket.emit("stream-created", { roomId });
    console.log("user created the stream");
};

const joinStream = ( roomId ) => {
    console.log("user joined the stream", roomId);
    socket.join(roomId);
};

socket.on("create-stream", createStream);
socket.on("join-room", joinStream);