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

            meetingUsers[data.meetId].forEach((element) => {
                if(element[0] === socket.id){
                    return;
                }
            })
            socket.join(data.meetId);
            meetingUsers[data.meetId].push([socket.id, data.name]);

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
    })

    socket.on("sendingSignal", (userToSignal, callerID, signal) => {
        io.to(userToSignal).emit('userJoined', {
            signal: signal,
            callerID: callerID
        })
    })

    socket.on("returningSignal", (signal, callerID) => {
        io.to(callerID).emit("receivingReturnSignal", {
            signal: signal,
            id: socket.id
        })
    })
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})