var monk = require ("monk");
var db = monk ("mongodb://IbmCloud_1140l45k_8qs5ds2q_sufis1th:Mmz7FogwIVV1t_48chUHn1vs8lKPGwQ1@ds041190.mongolab.com:41190/IbmCloud_1140l45k_8qs5ds2q");


var putQuestion = function(questionData, callback) {
	var questionCol = db.get("question");
	questionData.timestamp = new Date().getTime();
	questionCol.insert(questionData, function (error, response) {
		  callback(response);
	});
};

var getQuestions = function(filter, callback) {
	var questionCol = db.get("question");
	console.log("printing the filter for the getQuestions:");
	console.log(filter);
	var filterJson = {};
	if(filter && filter.category){
		filterJson = {category : filter.category};
	}
	questionCol.find(filterJson, {sort : { category : 1 }}, function (error, questionsList) {
		  callback(questionsList);
	});
};


var getLastQuestion = function(filter, callback) {
	var questionCol = db.get("question");
	console.log("printing the filter for the getLastQuestion:");
	console.log(filter);
	var filterJson = {};
	if(filter && filter.category){
		filterJson = {category : filter.category};
	}
	questionCol.find(filterJson, {sort : { timestamp : -1 }, "limit" : 1}, function (error, lastQuestion) {
		  callback(lastQuestion);
	});
};


var deleteQuestions = function(filter, callback) {
	var questionCol = db.get("question");
	questionCol.drop(function (error, questionsList) {
		  callback(questionsList);
	});
};


module.exports.putQuestion = putQuestion;

module.exports.getQuestions = getQuestions;

module.exports.deleteQuestions = deleteQuestions;

module.exports.getLastQuestion = getLastQuestion;
