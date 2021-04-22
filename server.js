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

    socket.on('checkMeetExists', (data, handleCheckResponse) => {
        if(meetingUsers[data]){
            handleCheckResponse("exists");
        } else {
            handleCheckResponse("notExists");
        }
    })

    socket.on('joinMeet', (data, generateStream) => {

        if(meetingUsers[data.meetId]){
            socket.join(data.meetId);
            meetingUsers[data.meetId].push([socket.id, data.name]);

            io.to(data.meetId).emit("newJoinee", data.name);
            generateStream();
        } else {
            meetingUsers[data.meetId] = [[socket.id, data.name]];
            socket.join(data.meetId);

            generateStream();
        }
    })

    socket.on("getAllUsers", (meetId) => {
        const usersHere = meetingUsers[meetId].filter(id => id[0] !== socket.id);
        socket.emit("allUsers", usersHere);

        console.log(usersHere);
    })

    socket.on("sendingSignal", payload => {
        io.to(payload.userToSignal).emit('userJoined', {
            signal: payload.signal,
            callerID: payload.callerID
        })
    })

    socket.on("returningSignal", payload => {
        io.to(payload.callerID).emit("receivingReturnSignal", {
            signal: payload.signal,
            id: socket.id
        })
    })
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})