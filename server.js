require('dotenv').config({
    path: './config/config.env'
})

const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(`${process.env.PORT}`, (req, res) => {
    console.log("Server Listening");
})