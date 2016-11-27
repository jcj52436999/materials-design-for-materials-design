// BART Departure Information

// func to convert an XML data blob response to some query,
// call directly from other processes as needed.
var parseXML = function(responseXML) {
  var response = xml2json(responseXML);
  response = response.replace("undefined", "");
  return JSON.parse(response).root;
};

// func for taking a data blob response for a specific station from a $.get,
// call directly from a $.get funtion as needed.
var processData = function(responseXML) {
  // setTimeout(10000);
  var response = parseXML(responseXML);
  // console.log(response);
  showData(response);
  //instead of using the function I wrote, I pulled the time from the BART query.
  // showDateTime();
};

// processStations converts the station XML data and sets showStations to the array of station information buried in the stations object.

var processStations = function(responseXML) {
  // setTimeout(5000);
  var stations = parseXML(responseXML);
  var stationList = stations.stations.station;
  showStations(stationList);
};

var showData = function(response) {
  var $departureTime = $("#departureTime");
  var station = response.station.name;
  console.log(response);
  $("#station").html("Departures from " + station + " station");
  var departures = response.station.etd;
  console.log(departures.length);
  var departureList = "";
  //testing to see if departures is an array
  var toClass = {}.toString; // (1)
//  alert( toClass.call( departures) );
  var isArray = toClass.call(departures );


  //test to see if variable departures is an array.  If it is, step through all destinations.
  if (isArray == "[object Array]") {
    for (var i = 0; i < departures.length; i++) {
 //     console.log("in the loop");
      departureList = departureList.concat("Destination:&nbsp", departures[i].destination, "<br>");
      var estimateTime = departures[i].estimate;
  //    alert(toClass.call(estimateTime));
      var estimateArray = toClass.call(estimateTime);
      if (estimateArray=="[object Array]") {

        for (var y = 0; y < estimateTime.length; y++) {
 //         console.log("estimate for loop" + estimateTime.length);
//          console.log(estimateTime[y].minutes);
         // departureList = departureList.concat("&nbsp&nbsp&nbsp", estimate[y].minutes, "&nbsp minutes<br>");
          departureList = departureList.concat("&nbsp&nbsp&nbsp", estimateTime[y].minutes, "&nbsp minutes<br>");
//          console.log("done");
        }
      } else {
        departureList = departureList.concat("&nbsp&nbsp&nbsp", estimateTime.minutes, "&nbsp minutes<br>");
      }
      departureList = departureList.concat("<br>");
    }
    //else is for stations that only have one destination - not an array
  } else {
//    console.log("in else");
    departureList = departureList.concat("Destination:&nbsp", departures.destination, "<br>");
    var estimateTime = departures.estimate;
    var estimateArray = toClass.call(estimateTime);
    if (estimateArray=="[object Array]") {
//      console.log("estimate length T");
      for (var y = 0; y < estimateTime.length; y++) {
        departureList = departureList.concat("&nbsp&nbsp&nbsp", estimateTime[y].minutes, "&nbsp minutes<br>");
      }
    } else {
//            console.log("estimate length null");
      departureList = departureList.concat("&nbsp&nbsp&nbsp", estimateTime.minutes, "&nbsp minutes<br>");
    }
    departureList = departureList.concat("<br>");
  }
//  console.log("out");
//  console.log(departureList);
  $("#departureTime").html(departureList);
  $("#datetime").html(response.time);
}; //showData

var showDateTime = function() {
  var dateTime = Date();
  $("#datetime").html(dateTime);
};

//populate control "pick-station" with BART station names
var showStations = function(response) {
  var $select = $("#pick-station");
  for (var i = 0; i < response.length; i++) {
    var $option = $("<option></option>");
    var abbr = response[i].abbr;
    var name = response[i].name;
    $option.html(name);
    $option.val(abbr);
    //add option to select menu
    $select.append($option);
    // console.log(response[i].abbr);

  }
};

var findDepartures = function() {
    $("#departureTime").html("");
  var $select = $("#pick-station");
  var stationAbbr = $(this).val();
  $.get({
    url: "http://api.bart.gov/api/etd.aspx",
    dataFormat: "xml",
    data: {
      cmd: "etd",
      orig: stationAbbr,
      key: "MW9S-E7SL-26DU-VV8V"
    },
    timeout: 10000,
    success: processData
    // success: processData.setTimeout(logConsoleA,10000)
    // success: setTimeout(processData, 10000)
  });
};

var logConsoleA = function() {
  console.log("A delay");

}

$.get({
  url: "http://api.bart.gov/api/stn.aspx",
  dataFormat: "xml",
  data: {
    cmd: "stns",
    key: "MW9S-E7SL-26DU-VV8V",
  },
  timeout: 3000,
  success: processStations
  // success: setTimeout(processStations, 3000)
});

$("#pick-station").change(findDepartures);
