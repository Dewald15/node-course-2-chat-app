//root of our node application
//create a new express app
//configure the public directory to be the static folder express serves up
//it will call app.listen to start up the server

const path = require('path'); //does not need to be installed, it is a build in module, you have access to it using npm
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

//uncomment to see difference between two path methods
// console.log(__dirname + '/../public');
// console.log(publicPath); 