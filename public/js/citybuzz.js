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

    var initialMapUpdateScheduler = setInterval(reloadMap, 5000);

    category=undefined;

    arrayOfTimers = [];
    arrayOfTimers.push(initialMapUpdateScheduler);

    function reloadMap() {

        if (category===undefined) {
            theUrl = '/getAnswers';
	} else {
            theUrl = '/getAnswers?category=' + category;
            console.log("#### ## WITH CATEGORY " + category);
        }
         $.ajax({
             url: theUrl,
             success: function getAnswers(data) {
                 console.log('got it!');
                 console.log(data.res);
                 placeMarkersOnTheMap(data.res); },
             error: function(data) {
		 alert('request failed :'+data);
             },
             dataType: 'json' 
         });
    }

    //http://localhost:3000/getQuestions?Category=Culture

    arrayOfMarkers = [];

    function placeMarkersOnTheMap(pointsFromAjaxRequest) {

	pointsFromAjaxRequest.forEach(function(point) {
            //console.log("adding point,coordX = " + point.coordX);
            //console.log("adding point,coordY = " + point.coordY);
            var marker = L.marker([point.coordX, point.coordY]).addTo(map)
		.bindPopup(point.answer).openPopup();
            
            arrayOfMarkers.push(marker);
	});

    }
    
    $('.category-option').click(function() {
	console.log('drop down option SELECTED! ' + $(this).html() );
       
        clearAllTimers();
        clearAllMarkers();        

        category=$(this).html();
  
        reloadMap();
        var categoryUpdateScheduler = setInterval( reloadMap , 5000 );
        arrayOfTimers.push(categoryUpdateScheduler);
    });

    function clearAllTimers() {
	for (var i = 0; i < arrayOfTimers.length; i++) {
            clearInterval(arrayOfTimers[i]);
	}
        arrayOfTimers = [];
    }

    function clearAllMarkers() {
	for (var i = 0; i < arrayOfMarkers.length; i++) {
            map.removeLayer(arrayOfMarkers[i]);
        }
        arrayOfTimers = [];
    }

});