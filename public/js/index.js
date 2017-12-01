var socket = io();

socket.on('connect', function(){ //built in event
    console.log("Connected to server");
});

socket.on('disconnect', function(){ //built in event
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){  //custom event
    console.log('New message:', message);
});