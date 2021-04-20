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

io.on('connection', socket => {
    
})

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})