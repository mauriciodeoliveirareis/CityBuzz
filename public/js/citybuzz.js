$( document ).ready(function() {
    console.log( "ready!" );
    
    $('#dialog').jqm({
	onHide: function(hash) {
	    //$("#dialog-msg").html('');
	    $("#dialog-msg").css('height','auto');
	    hash.w.fadeOut('2000',function(){
                hash.o.remove();
	    });
	}}); 
    
    $('.btn-learn-more').click(function() {

	$('#dialog').jqmShow();

    });
    $('#close-stats-dialog').click(function() {
        $('#dialog').jqmHide();
     });



    var map = L.map('map').setView([53.3478, -6.2597], 12);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'examples.map-i875mjb7'
    }).addTo(map);

    $.ajax({
	url: '/getAnswers',
	success: function getAnswers(data) {

	    console.log('got it!');
	    console.log(data.res);

            placeMarkersOnTheMap(data.res);

	},
	dataType: 'json'
    });

    var time = setInterval(reloadMap, 5000);

    function reloadMap() {
         $.ajax({
             url: '/getAnswers',
             success: function getAnswers(data) {
                 console.log('got it!');
                 console.log(data.res);
                 placeMarkersOnTheMap(data.res); },
             dataType: 'json' 
    }); }

    //http://localhost:3000/getQuestions?Category=Culture

    function placeMarkersOnTheMap(pointsFromAjaxRequest) {

	pointsFromAjaxRequest.forEach(function(point) {
            console.log("adding point,coordX = " + point.coordX);
            console.log("adding point,coordY = " + point.coordY);
            L.marker([point.coordX, point.coordY]).addTo(map)
		.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
	});

    }

});