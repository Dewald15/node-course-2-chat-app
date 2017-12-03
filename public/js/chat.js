var socket = io();

function scrollToBottom (){
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight'); // 'prop' is a cross-browser way to fetch a property. This is a jQuery alternative to doing it. Without jQuery, we make sure it works across all browsers regardless of what they call the prop
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight(); //this will calculate the inner height of the message taking into account the padding that we also applied via css
    var lastMessageHeight = newMessage.prev().innerHeight(); // second last item from 'li:last-child'
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){ // left side of comparison can be > than 'scrollHeight' becuase 'newMessageHeight' and 'lastMessageHeight' is not taken into consideration from messages.prop('scrollHeight'); at this stage probably due to either the 'newMessage' socket.on method where this method 'scrollToBottom()' is called, is asynchronous, or/and the 'Mustache.render' method's asynchronousation also inside 'newMessage'
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){ //built in event
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    });
});

socket.on('disconnect', function(){ //built in event
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', function(message){  //custom event
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html(); //html() will return the markup inside of #message-template
    var messages = jQuery('#messages');
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