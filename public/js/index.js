var socket = io();

function scrollToBottom (){
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){ //built in event
    console.log("Connected to server");
});

socket.on('disconnect', function(){ //built in event
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){  //custom event
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html(); //html() will return the markup inside of #message-template
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    
    // a.attr('href', message.url); //you can set and fetch attributes on your jQuery selected elements using this method. If you provide one argument like target, it fetches the value. If you specify two arguments, it sets the value  
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