const express = require('express');
const socket = require('socket.io');

const app = express()
let port = 3000;

app.use(express.static('client'));

let server = app.listen(port, () => {
    console.log("listening to port 3000");
})

let io = socket(server);

io.on('connection', (socket) => {
    console.log("connection made");

    socket.on('startDrawing', (data) => {
        io.sockets.emit('startDrawing', data);
    })
    socket.on('draw', (data) => {
        io.sockets.emit('draw', data);
    })
    socket.on('stopDrawing', () => {
        io.sockets.emit('stopDrawing');
    })
    socket.on('stackUpdate', (data) => {
        io.sockets.emit('stackUpdate', data);        
    })
    socket.on('undo', () => {
        io.sockets.emit('undo');        
    })
    socket.on('redo', () => {
        io.sockets.emit('redo');        
    })
})