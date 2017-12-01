var moment = require('moment');

var createdAt = new Date();

var timeStamp = moment().valueOf();
console.log(timeStamp);

var date = moment(createdAt); //this creates a new moment object that represents the current point in time
console.log(date.format('MMM Do, YYYY'));

var timeDate = moment(createdAt);
console.log(date.format('h:mm a'));

// install in project dir using command:
//     npm i moment@2.15.1 --save   