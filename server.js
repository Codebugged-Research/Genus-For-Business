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

function generateMeetId(){
    const meetId = (new Date().getTime() * 5) % 100000000000;
    return meetId;
}

const meetingUsers = {};

io.on('connection', socket => {

    socket.on('createMeet', (name, createdMeeting) => {
        const meetId = generateMeetId();

        if(!meetingUsers[meetId]){
            meetingUsers[meetId] = [socket.id, name];
            socket.join(meetId);

            createdMeeting(meetId);   
        } else {
            createdMeeting(generateMeetId()); //second chance for generating a unique key
        }
    })

    socket.on('joinMeet', (name, meetId, joinedMeeting, wrongMeeting) => {

        if(meetingUsers[meetId]){
            socket.join(meetId);
            meetingUsers[meetId].push(socket.id, name);
            joinedMeeting();
        } else {
            wrongMeeting();
        }
    })
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})