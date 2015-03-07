/*jshint node:true*/

var express = require('express');
var easypost = require ('easypost');
var mongo = require ('mongodb');
var monk = require ("monk");


var questionDao = require('./questionDao');

var database = null;

var db = monk ("mongodb://IbmCloud_1140l45k_8qs5ds2q_qj7pb4ag:DZpyBj_hkmGPicWP99GFyqykDyhk4BRc@ds041190.mongolab.com:41190/IbmCloud_1140l45k_8qs5ds2q");


// setup middleware
var app = express();
app.use(app.router);
app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views

app.get('/', function(req, res){
	res.render('index.ejs');
});


/**
Gets all the questions filtering by location
*/
app.get('/getQuestions', function(req, res){
	console.log("getQuestions called, the query is:");
	console.log(req.query);
	questionDao.getQuestions(req.query, function(data){
		console.log("Called getQuestions, the json result is: ");
		console.log(data);
		res.json({"res" : data});
	});

});

/**
 * handles the posted data from the clients
 */
app.post ("/putQuestion", function(req, res) {
	console.log ("putQuestion called");
	easypost.get (req, res, function(data) {
	  console.log ("printing the data received in post:");
	  console.log(JSON.parse(data));
	  questionData = JSON.parse(data);
	  if (questionData) {
	  	questionDao.putQuestion(questionData, function(data){
			console.log("Called putQuestion in Dao");
			res.json({"res" : data});
		  });

    }

	});
});



//DO NOT TOUCH FROM HERE!
// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);

app.listen(port, host);
console.log('App started on port ' + port);
