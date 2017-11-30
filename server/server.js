//root of our node application
//create a new express app
//configure the public directory to be the static folder express serves up
//it will call app.listen to start up the server

const path = require('path'); //does not need to be installed, it is a build in module, you have access to it using npm
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //what we get back is our web sockets server. We can emit or listen to events on io. This is how we are gonna communicate between the server and the client

app.use(express.static(publicPath)); //configure middleware via express

io.on('connection', (socket) => {   //is.on() lets you register an event listener. we can listen for a specific event and do something when that event happens
    console.log('New user connected');

    socket.on('createMessage', (message) => {
        console.log('Create message', message);
        io.emit('newMessage', { //io.emit() emits an event to every single connection, socket.io() emits an event to a single connection
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
}); 

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

//uncomment to see difference between two path methods
// console.log(__dirname + '/../public');
// console.log(publicPath); 