var http = require('http');
var dbManager = require('../workflow/dbManager');

var callback = function(response) {
	var str = "";
	
	response.on("data", function(chunk) {
		str += chunk;
	});
	
	response.on("end", function() {
		console.log(str);
		
		var _json = JSON.parse(str);
		dbManager.saveToDb(_json);
	});
};

exports.httpRequest = function(spaceId, entryId, accessToken, proxyHost, proxyPort) {	
	var _path = "/spaces/" + spaceId + "/entries/" + entryId + "?access_token=" + accessToken;
	
	var options = {};
	if (!proxyHost && !proxyPort) {
		// no proxy specified
		options = {
			host: "cdn.contentful.com",
			path: _path,			
		};
	}
	else {
		// proxy specified
		options = {
			host: proxyHost,
			port: proxyPort,
			path: _path,
			headers: {
				Host: 'cdn.contentful.com'
			}
		};	
	}
	
	http.request(options, callback).end();
}