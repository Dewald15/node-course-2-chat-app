var expect = require('expect'); //this is gonna let us make our assertions about the return value from our generate message funcion in message.js

var {generateMessage, generateLocationMessage} = require('./message');//module we're testing pulling of from message.js module.exports

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = "DeeDude";
        var text = "Text from DeeDude"
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'someDude'
        var latitude = 123;
        var longitude = 123;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var locationMessage = generateLocationMessage(from, latitude, longitude);

        expect(locationMessage.createdAt).toBeA('number');
        expect(locationMessage).toInclude({from, url});
    });
});