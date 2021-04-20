require('dotenv').config({
    path: './config/config.env'
})

const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors:{
        origin: "http://localhost:3000"
    }
})

const meetingUsers = {};

io.on('connection', socket => {

    socket.on('createMeet', (name, createdMeeting) => {
        const meetId = (new Date().getTime() * 5) % 100000000;

        createdMeeting(meetId);
    })
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})