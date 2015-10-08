var ContentfulEntry = require('../models/contentfulEntry').ContentfulEntry;
var DBManager = require("../workflow/dbManager");
var DateTimeManager = require("../workflow/dateTimeManager");
var HttpManager = require("../workflow/httpManager");
var http = require("http");

 var _maxAge = 24 * 60 * 60 * 1000; // currently set for one day
//var _maxAge = 1000;

var _spaceId = "";
var _entryId = "";
var _apiKey = "";
var _res = {};

var _options = {};
exports.init = function(_host, _proxyHost, _proxyPort) {	 
	if (!_proxyHost && !_proxyPort) {
		// no proxy specified
		_options = {
			host: _host			
		};
	}
	else {
		// proxy specified
		_options = {
			host: _proxyHost,
			port: _proxyPort,
			headers: {
				Host: _host
			}
		};	
	}
};

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
		beginReadFromDatabase(endReadFromDatabase);	
	}
};

var beginReadFromDatabase = function(callback) {
	DBManager.read(_spaceId, _entryId, callback);
};

var endReadFromDatabase = function(_response) {
	if (!_response.entry) {
		// entry could not be found
		// attempt to get from webservice
		beginGetFromWebService(_spaceId, _entryId, _apiKey, endGetFromWebService);
	} else {
		// entry was found
		if (DateTimeManager.isContentExpired(_response.entry._doc.contentfulDateCreated, _maxAge)) {
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
	_options.path = _path;
		
	http.request(_options, callback).end();		
};

var endGetFromWebService = function(res, _response) {
	var str = "";
	
	res.on("data", function(chunk) {
		str += chunk;
	});
	
	res.on("end", function() {
		console.log(str);
		
		var _json = JSON.parse(str);
		
		// do we already have this id in the database?
		// no, we don't. add it.
		beginSaveToDatabase(_json, endSaveToDatabase);
	});
};

var beginSaveToDatabase = function(data, callback) {
	DBManager.save(data, callback);
}

var endSaveToDatabase = function(data, callback) {
	if (data.entry) {
		_res.json(200, { entry: data.entry });
	} else {
		_res.json(403, { message: data.message });
	}
}
