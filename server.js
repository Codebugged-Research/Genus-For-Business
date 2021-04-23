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

        } else {
            meetingUsers[data.meetId] = [[socket.id, data.name]];
            socket.join(data.meetId);
            
        }
        socket.emit("intializeStream");
    })

    socket.on("getAllUsers", (meetId) => {
        const usersHere = meetingUsers[meetId].filter(id => id[0] !== socket.id); 
        socket.emit("allUsers", usersHere);
    })

    socket.on("callUserGetStream", (data) => {
        io.to(data.toCall).emit("handshake", {mySignal: data.dataSentAlong, sender: data.sender, name: data.name});
    })

    socket.on("handshakeAccepted", (data) => {
        io.to(data.for).emit("accepted", {forYou: data.acceptor});
    })
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})