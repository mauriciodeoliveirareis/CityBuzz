$( document ).ready(function() {
    console.log( "ready!" );
    
    //red and green files for markers
    var greenIcon = L.icon({
	iconUrl: 'js/images/marker-icon-green.png'
    });

    var redIcon = L.icon({
	iconUrl: 'js/images/marker-icon-red.png'
    });

    $('#dialog').jqm({
	onHide: function(hash) {
	    //$("#dialog-msg").html('');
	    $("#dialog-msg").css('height','auto');
	    hash.w.fadeOut('2000',function(){
                hash.o.remove();
	    });
	}}); 
    
    $('.btn-showstats').click(function() {

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

            var typeOfDeviceIcon = ""; // appID: "1" //the kind of client that is sending data 
                                       // (1 for android, 2 for hardware, 3 for web)
            console.log("The appID: " + point.appID);
            if (point.appID=="1") {
                typeOfDeviceIcon = "<img src='/js/images/type-device-android.png' width='25' height='25' border='0'/>";
            } else if (point.appID=="2") {
                typeOfDeviceIcon = "<img src='/js/images/type-device-galileo.png' width='25' height='25' border='0'/>";
            } else {
                typeOfDeviceIcon = "<img src='/js/images/type-device-ios.png' width='25' height='25' border='0'/>";
            }
           
            if(point.answer == '1'){
                var marker = L.marker([point.coordX,
				       point.coordY],{icon:
                                       greenIcon}).addTo(map).bindPopup(point.category + "<br/>" + typeOfDeviceIcon).openPopup();
            }else{
                var marker = L.marker([point.coordX,
				       point.coordY],{icon:
				       redIcon}).addTo(map).bindPopup(point.category + "<br/>" + typeOfDeviceIcon).openPopup();
            }
            
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

function buildPieChart(chartData){
		
        // Build the chart
        $('#panel-body').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: chartData.question
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: chartData.chartType,
                name: chartData.question,
				colors: ['#7cFF22', '#FF2222'],
                data: [
                    ['Yes',   chartData.yesPercentage],
                    {
                        name: 'No',
                        y: chartData.noPercentage,
                        sliced: true,
                        selected: true
                    }
                ]
            }]
        });
	}

function ajaxCall(){
			
			$.ajax({
			url: '/getAnswers',
			success: function getAnswers(data) {
                 setPieChart(data.res); },
             error: function(data) {
		 alert('request failed :'+data);
             },
             dataType: 'json' 
         });
}

function setPieChart(pointsFromAjaxRequest) {
var yescounter = 0;
var nocounter = 0;
	$.each(pointsFromAjaxRequest, function() {
		if(this.answer=='YES'){
			yescounter++;
		}
		else if (this.answer=='NO'){
			nocounter++;
		}
		
    });
	var first = pointsFromAjaxRequest[0].question;
	var testData = {
				question: first,
				chartType:'pie',
				yesPercentage : yescounter,
				noPercentage : nocounter
			};
	buildPieChart(testData);
    }