var monk = require ("monk");
var db = monk ("mongodb://IbmCloud_1140l45k_8qs5ds2q_sufis1th:Mmz7FogwIVV1t_48chUHn1vs8lKPGwQ1@ds041190.mongolab.com:41190/IbmCloud_1140l45k_8qs5ds2q");


var putAnswer = function(answerData, callback) {
	var answerCol = db.get("answer");
  answerData.timestamp = new Date().getTime();
	answerCol.insert(answerData, function (error, response) {
		  callback(response);
	});
};

var getAnswers = function(filter, callback) {
	var answerCol = db.get("answer");
  console.log("printing the filter for the getAnswers:");
  console.log(filter);
  var filterJson = {};
	if(filter){
    if(filter.question_id) {
		    filterJson.question_id = filter.question_id;
    }
    if(filter.category) {
		    filterJson.category = filter.category;
    }
	}
  console.log(filterJson);
	answerCol.find(filterJson, {sort : { timestamp : -1 }}, function (error, answersList) {
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
