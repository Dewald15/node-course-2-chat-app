//root of our node application
//create a new express app
//configure the public directory to be the static folder express serves up
//it will call app.listen to start up the server

const path = require('path'); //does not need to be installed, it is a build in module, you have access to it using npm
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //what we get back is our web sockets server. We can emit or listen to events on io. This is how we are gonna communicate between the server and the client
var users = new Users();

app.use(express.static(publicPath)); //configure middleware via express

io.on('connection', (socket) => {   //io.on() lets you register an event listener. we can listen for a specific event and do something when that event happens
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        };

        socket.join(params.room); //only emit to users in room
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined.`));  //the differance between io.emit and socket.emit in comparison to 'broadcast.emit' is who it gets sent to. 'broadcast.emit' will send the message to everyone but this socket/connection    
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); //io.emit() emits an event to every single connection, socket.emit() emits an event to a single connection
        };

        callback(); //Event acknowledgement letting client know message was recieved by the server
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        io.to(user.room).emit('newLocationMessage', generateLocationMessage(`${user.name}'s Location `, coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        };
    }); 
}); 

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

//uncomment to see difference between two path methods
// console.log(__dirname + '/../public');
// console.log(publicPath); 