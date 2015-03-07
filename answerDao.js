var monk = require ("monk");
var db = monk ("mongodb://IbmCloud_1140l45k_8qs5ds2q_sufis1th:Mmz7FogwIVV1t_48chUHn1vs8lKPGwQ1@ds041190.mongolab.com:41190/IbmCloud_1140l45k_8qs5ds2q");


var putAnswer = function(answerData, callback) {
	var answerCol = db.get("answer");

	answerCol.insert(answerData, function (error, response) {
		  callback(response);
	});
};

var getAnswers = function(filter, callback) {
	var answerCol = db.get("answer");
	//TODO use filter
	answerCol.find({}, {sort : { answerCode : 1 }}, function (error, answersList) {
		  callback(answersList);
	});
};

var deleteAnswers = function(filter, callback) {
	var answerCol = db.get("answer");
	answerCol.drop(function (error, answersList) {
		  callback(answersList);
	});
};


module.exports.putAnswer = putAnswer;

module.exports.getAnswers = getAnswers;

module.exports.deleteAnswers = deleteAnswers;
