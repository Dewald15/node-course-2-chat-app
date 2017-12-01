var socket = io();

socket.on('connect', function(){ //built in event
    console.log("Connected to server");
});

socket.on('disconnect', function(){ //built in event
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){  //custom event
    console.log('New message:', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.emit('createMessage', {
    from: 'DeeDude',
    text: 'Text from DeeDude'
}, function(data) { //callback function called by server if received 
    console.log("Got it!", data);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){

    });
});