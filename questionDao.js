var monk = require ("monk");
var db = monk ("mongodb://IbmCloud_1140l45k_8qs5ds2q_sufis1th:Mmz7FogwIVV1t_48chUHn1vs8lKPGwQ1@ds041190.mongolab.com:41190/IbmCloud_1140l45k_8qs5ds2q");


var putQuestion = function(questionData, callback) {
	var questionCol = db.get("question");

	questionCol.insert(questionData, function (error, response) {
		  callback(response);
	});
};

var getQuestions = function(filter, callback) {
	var questionCol = db.get("question");
	//TODO use filter
	questionCol.find({}, {sort : { questionCode : 1 }}, function (error, questionsList) {
		  callback(questionsList);
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
