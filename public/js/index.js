var socket = io();

socket.on('connect', function(){ //built in event
    console.log("Connected to server");
});

socket.on('disconnect', function(){ //built in event
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){  //custom event
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location<a/>'); // target="_blank" tells the browser to open up the url in a new tab as opposed to redirecting the current tab

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url); //you can set and fetch attributes on your jQuery selected elements using this method. If you provide one argument like target, it fetches the value. If you specify two arguments, it sets the value  
    li.append(a);
    jQuery('#messages').append(li);
});

socket.emit('createMessage', {
    from: 'DeeDude',
    text: 'Text from DeeDude'
}, function(data) { //callback function called by server if received 
    console.log("Got it!", data);
});

jQuery('#message-form').on('submit', function(e){ // .on() specifies event listener
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if(!navigator.geolocation){ //geolocation api exists on navigator 
        return alert('Geolocation not supported by your browser.');
    };

    locationButton.attr('disabled', 'disabled').text('Sending location..');

    navigator.geolocation.getCurrentPosition( function (position) { //getCurrentPostion is a function that starts the process, it's going to actively get the coordinates for the user..in this case, it will get the coordinates based of the browser
    locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled');
        alert('Unable to fetch location');
    });
});