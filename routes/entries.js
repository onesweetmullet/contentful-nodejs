var ContentfulEntry = require('../models/contentfulEntry').ContentfulEntry;
var DBManager = require("../workflow/dbManager");
var DateTimeManager = require("../workflow/dateTimeManager");
var HttpManager = require("../workflow/httpManager");
var http = require("http");

var _maxAge = 24 * 60 * 60 * 1000; // currently set for one day

var _spaceId = "";
var _entryId = "";
var _apiKey = "";
var _res = {};

exports.index = function(req, res) {
	ContentfulEntry.find({}, function(err, docs) {
		if (!err) {
			res.json(200, { entries: docs });
		} else {
			res.json(500, { message: err });
		}
	});
};

exports.getSpecificEntry = function(req, res) {
	_spaceId = req.params.spaceId;
	_entryId = req.params.entryId;
	_apiKey = req.params.apiKey;
	_res = res;
	 
	var _forceRefresh = (req.params.forceRefresh.toLowerCase() === 'true');
	
	// request entry by spaceid, entryid, apikey
	// first, get from db
	// if db version exists...
		// is it expired?
		// are we forcing a refresh?
		// if yes to either question, get new version from contentful
			// store new version from contentful to db		
	// if db version does not exist
		// get new version from contentful
		// store new version from contentful to db
	// return db version
	
	if (_forceRefresh) {
		beginGetFromWebService(_spaceId, _entryId, _apiKey, endGetFromWebService);
	} else {
		beginGetFromDatabase(endGetFromDatabase);
		//DBManager.read(res, _spaceId, _entryId, endGetFromDatabase);	
	}
};

var beginGetFromDatabase = function(callback) {
	DBManager.read(_spaceId, _entryId, callback);
};

var endGetFromDatabase = function(_response) {
	if (!_response.entry) {
		// entry could not be found
		// attempt to get from webservice
		beginGetFromWebService(_spaceId, _entryId, _apiKey, endGetFromWebService);
	} else {
		// entry was found
		if (DateTimeManager.isContentExpired(_response.entry._doc.createdAt, _maxAge)) {
			// expired
			beginGetFromWebService(_spaceId, _entryId, _apiKey, endGetFromWebService);
		} else {
			// not expired
			_res.json(200, { entry: _response });
		}	
	}	
};

var beginGetFromWebService = function(spaceId, entryId, apiKey, callback) {
	//HttpManager.httpRequest(spaceId, entryId, apiKey)
	var _path = "/spaces/" + spaceId + "/entries/" + entryId + "?access_token=" + apiKey;
	
	var options = {};
	// if (!proxyHost && !proxyPort) {
		// no proxy specified
		options = {
			host: "cdn.contentful.com",
			path: _path,			
		};
	// }
	// else {
	// 	// proxy specified
	// 	options = {
	// 		host: proxyHost,
	// 		port: proxyPort,
	// 		path: _path,
	// 		headers: {
	// 			Host: 'cdn.contentful.com'
	// 		}
	// 	};	
	// }
	
	http.request(options, callback).end();		
};

var endGetFromWebService = function(res, _response) {
	var str = "";
	
	res.on("data", function(chunk) {
		str += chunk;
	});
	
	res.on("end", function() {
		console.log(str);
		
		var _json = JSON.parse(str);
		
	});
};

var beginCreateToDatabase = function(data, callback) {
	
};

var endCreateToDatabase = function(response, callback) {
	
};

var beginUpdateToDatabase = function(data, callback) {
	
};

var endUpdateToDatabase = function(response, callback) {
	
};