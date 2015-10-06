var mongoose = require("mongoose");
var ContentfulEntry = require("../models/contentfulEntry").ContentfulEntry;

exports.saveToDb = function(json) {
	var newEntry = new ContentfulEntry();
	newEntry.spaceId = json.sys.space.sys.id.toString();
	newEntry.entryId = json.sys.id.toString();
	newEntry.name = json.fields.name.toString();
	newEntry.content = json.fields.content.toString();
	newEntry.description = json.fields.description.toString();
	newEntry.createdAt = json.sys.createdAt;
	newEntry.updatedAt = json.sys.updatedAt;
	
	newEntry.save(function(err) {
		if (!err) {
			console.log("saved new entry to db!");
		}
		else {
			console.log("could not save new entry to db");
		}
	});	
	
};