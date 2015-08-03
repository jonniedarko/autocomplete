'use strict';

var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/autocomplete';
var User = require('./model/User');
mongoose.connect(dbURI);

// Error Handling
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/*(function populateDb(){
	console.log('populating DB')
	var users = [{username: 'john'},{username: 'jame'}, {username: 'tom'}, {username: 'Ash'}, {username: 'Alex'}, {username: 'tim'}];

	User.create(users, function(err){
		if(err) console.log('Error adding Users: ', err);

	});

})();*/


app.use(express.static(__dirname + '/public'));
app.get('/search', function(req, res){
	var regex = new RegExp(req.query["term"], 'i');
	var query = User.find({username: regex}, { 'username': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
	query.exec(function(err, users) {
		if (err) {
			return res.status(500).json(err);
		}
		return res.status(200).json(users);
	});

	//res.status(200).json('Searching...');
});

console.log('now listening');
app.listen(3000, 'localhost');