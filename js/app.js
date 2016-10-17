// GLOBAL VARIABLES:
var url = 'http://localhost:8080/route4';
var routeList=[];
var routeDetails = [];
var routeList_partial = [];
var userJourney = [];
var str_bus_routes = '';
var busJourney = [];


// MAPPINGS:
var Map = {};

// ROUTE 1: KBS - 1ST BLOCK KORAMANGALA
Map['171-C'] = 19131;
Map['171-F'] = 22499;
Map['171-J'] = 29595;

// ROUTE 2: CENTRAL SILK BOARD - ELECTRONIC CITY
Map['600-CH'] = 19570;
Map['600-F'] = 19701;
Map['CJP-ELCW'] = 32003;
Map['MEBP-ELC'] = 18367;

// ROUTE 3: CENTRAL SILK BOARD - MARATHAHALLI BRIDGE
Map['411-B'] = 7071;
Map['500-A'] = 7362;
Map['BSK-D10G'] = 8442;
Map['CSB-KDG'] = 10712;

// ROUTE 4: TIN FACTORY - MARATHAHALLI BRIDGE
Map['500-G'] = 2527;
Map['411-B'] = 7072;
Map['500-A'] = 7364;
Map['504'] = 8092;

// GET ELEMENTS
var txt_source = document.getElementById('txt_source');
var txt_destination = document.getElementById('txt_destination');
var txt_routeno = document.getElementById('txt_routeno');
var ddl_source = document.getElementById('ddl_source');
var ddl_destination = document.getElementById('ddl_destination');
var userSelectedSource;
var userSelectedDestination;

// GET JSON DATA AND PROCESS IT:
function getDataFromAPI(url){

	// MAKE A NETWORK CALL AND GET THE JSON DATA:
	// $.ajax({
	// 	url: url,
	// 	method: 'GET',
	// 	success: function (response) {
	// 		// PROCESS THE JSON DATA AND KEEP IT IN ARRAY:
	// 		console.log('response is: ', response);
	// 		processJSONData(response);
	// 	},
	// 	error: function(error) {
	// 		console.log('[JSON] Error in receiving JSON Data: ', error);
	// 	}
	// })

	fetch(url)
		.then(function(response){
			console.log('===============');
			//console.log(response.clone().json());
			return response.json();
      //processJSONData(response.json());
			//return response.json();
		}).then(function(j) {
			console.log('Parsed JSON --> ', j);
		 	processJSONData(j);
			// Yay, `j` is a JavaScript object
			console.log("Response 'j': ", j);
			//return j;
		})
		.catch(function(err){
			console.log('Parsing Failed --> ', err);
		});

}

// PROCESS JSON DATA RECEIVED:
// JSON DATA WAS OBTAINED BY MAKING A NETWORK CALL TO API:
// (IT COULD BE RETURNED FROM NETWORK OR CACHE (SERVICE WORKER WOULD DECIDE))
function processJSONData(jsonDataFromAPI){

	// PROCESS THE JSON OBJECT AND PUT IT IN ARRAY:
	for (var i=0;i<jsonDataFromAPI.length;i++){
		console.log(jsonDataFromAPI[i][1]);
		str_bus_routes = str_bus_routes + "," + jsonDataFromAPI[i][1];
		routeList.push(jsonDataFromAPI[i][1]);
	}

	localStorage["routeno"] = routeList;//routeList_partial;
	console.log('local storage routeno: ', localStorage["routeno"]);
	localStorage["userSource"] = userSelectedSource;
	localStorage["userDestination"] = userSelectedDestination;

	// REDIRECT THE USER TO SCREEN 2:
	window.location.href="bus_routes.html";
}

// PROCESS THE ROUTE LIST:
function processRouteList(routeList){

	// PROCESS routeList[] AND POPULATE routeList_partial[]:
	for (var i = 0; i < routeList.length; i++) {
		routeList_partial.push(routeList[i].split(','));
	}
}

// INITIALIZE THE VARIABLES WITH USER INPUT:
function initializeVariables(){
	userSelectedSource = ddl_source.options[ddl_source.selectedIndex].value;
	userSelectedDestination = ddl_destination.options[ddl_destination.selectedIndex].value;
}

// SUBMIT BUTTON HANDLER:
// 1. VALIDATE AND CHECK THE USER INPUT
// 2. LOAD THE DATA FROM JSON FILE/SERVICE
// 3. PROCEED TO bus_routes.html
function btn_GuideMe(){

	// INIT VARIABLES:
	initializeVariables();

	// VALIDATE USER INPUT:
	if(userSelectedSource === ''  ||  userSelectedDestination === ''){
		alert('User input not sufficient');
		return;
	}

	// CHECK USER INPUT:
	if(userSelectedSource === 'Kempegowda Bus Station' && userSelectedDestination === '1st Block Koramangala'){
		// Route 1 - Majestic to Koramangala
		url = 'http://localhost:8080/route1';
	}
	else if(userSelectedSource === 'Central Silk Board' && userSelectedDestination === 'Electronic City'){
		// Route 2 - Silk Board to Electronic City
		url = 'http://localhost:8080/route2';
	}
	else if(userSelectedSource === 'Central Silk Board' && userSelectedDestination === 'Marathahalli Bridge'){
		// Route 3 - Silk Board to Marathahalli
		url = 'http://localhost:8080/route3';
	}
	else if(userSelectedSource === 'Tin Factory' && userSelectedDestination === 'Marathahalli Bridge'){
		// Route 4 - Tin Factory to Marathahalli
		url = 'http://localhost:8080/route4';
	}
	else {
		// Route doesn't exist for the User's input
		alert('Invalid Input');
		return;
	}

	// INITIATE routeList[] WITH AVAILABLE BUS ROUTES FROM USER SOURCE TO DESTINATION:

	// GET JSON DATA FROM API/CACHE AND PROCESS JSON DATA TO routeList[]:
	getDataFromAPI(url);

	// PROCESS routeList[] TO OBTAIN LIST OF BUS ROUTES ON USER JOURNEY:
	// processRouteList(routeList);

	// INITIATE LOCAL STORAGE TO ACCESS ACROSS PAGES:

}


// USER JOURNEY FROM USER's SOURCE TO DESTINATION:
// 1. ALGO TO OBTAIN THE USER JOURNEY SET FROM BUS JOURNEY SET
// 2. RETURN ARRAY/SET OF USER JOURNEY
function getUserJourney(busJourney){

	// busJourney[] RECEIVED HERE IS ARRAY OF BUS STOPS (BUS JOURNEY) OF A BUS ROUTE
	var sub_array = []; // ARRAY OF USER JOURNEY - SUBSET OF busJourney[]
	var start = localStorage["userSource"]; // USER BOARDING LOCATION
	var end = localStorage["userDestination"]; // USER DE-BOARDING LOCATION

	console.log('Bus Journey -->> ', busJourney);

	// INIT sub_array[] WITH SUBSET OF USER'S JOURNEY:
	sub_array = init_sub_array(busJourney, start, end);

	console.log('Sub Array is: ', sub_array);

	// LOG USER JOURNEY
	console.log('[USER JOURNEY] Logging User Journey Details: ');
	for(var i = 0; i < sub_array.length ; i++){
		console.log(sub_array[i]);
	}
	return sub_array;
}

function getBusJourneyDataFromAPI(url){

	console.log('Parsing: ', url);
	// MAKE A NETWORK CALL AND GET THE JSON DATA:
	$.ajax({
		url: url,
		method: 'GET',
		success: function (response) {
			// PROCESS THE JSON DATA AND KEEP IT IN ARRAY:
			processJSONDataBusJourney(response);
		},
		error: function(error) {
			console.log('[JSON] Error in receiving JSON Data: ', error);
		}
	})
}

// PROCESS JSON DATA FOR BUS JOURNEY:
function processJSONDataBusJourney(jsonDataFromAPI){

	// LOOP THROUGH JSON OBJECT FOR BUS STOPS ON ROUTE SELECTED:
	for (var i=0;i<jsonDataFromAPI[0][7].length;i++){
		console.log(jsonDataFromAPI[0][7][i].start_bus_stop_name);
		busJourney.push(jsonDataFromAPI[0][7][i].start_bus_stop_name);
	}

	// INIT userJourney[] AND DISPLAY THE SUBSET (USER JOURNEY) FROM THE BUS JOURNEY
	userJourney = getUserJourney(busJourney);

	// INITIALIZE LOCAL STORAGE
	localStorage["userRoute"] = txt_routeno.value;
	localStorage["userJourney"] = userJourney;

	// NAVIGATE TO SCREEN 3:
	window.location.href="user_journey.html";
}

// INIT ARRAY OF USER JOURNEY (SUBSET OF BUS STOPS ON THE ROUTE):
function init_sub_array(busJourney, start, end){

	var indexOfSubArray = 0;
	var sub_array = [];

	// FLAG TO INDICATE WHEN TO START WRITING IN sub_array[]:
	var now_write = false;

	for (var indexOfBusJourney = 0; indexOfBusJourney < busJourney.length; indexOfBusJourney++) {

		// START WRITING INTO sub_array[] FROM USER's BOARDING LOCATION:
		if(busJourney[indexOfBusJourney] == start){
			sub_array[indexOfSubArray] = busJourney[indexOfBusJourney];
			indexOfSubArray++;
			now_write = true;
			continue;
		}

		// Write the sub_array with Bus Stops between User's BOARDING and
		// DE-BOARDING locations:
		if(now_write){
			sub_array[indexOfSubArray] = busJourney[indexOfBusJourney];
			indexOfSubArray++;
		}

		// End sub_array from User's DE-BOARDING location:
		if(busJourney[indexOfBusJourney] == end){
			break;
		}
	}
	return sub_array;
}


// START USER JOURNEY:
function btn_startJourney(){

	// CHECK USER'S INPUT:
	if(txt_routeno.value === ''){
		alert('Oops! You have not selected any Bus Route');
		return;
	}

	// CHECK IF THE SELECTION BELONGS TO THE BUS ROUTE
	// APPEND THE ROUTE ID TO THE URL TO GET DATA FROM API
	if( localStorage["routeno"].indexOf(txt_routeno.value) > -1 ){
		url = 'http://localhost:8080/route/' + Map[txt_routeno.value];
	}
	else {
		alert('Oops! Bus Route does not exist on your Journey');
		return;
	}

	getBusJourneyDataFromAPI(url);

}
