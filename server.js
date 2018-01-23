var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/spacebookDB');

// var Post = require('./models/postModel');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.get('/', function(req, res){
    res.send('hello!');
})



app.listen(process.env.PORT || '8000', function(){
    console.log('you r connected to port 8000!');
});