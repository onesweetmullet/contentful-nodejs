var mongoose = require("mongoose");
var ContentfulEntry = require("../models/contentfulEntry").ContentfulEntry;

exports.create = function(json) {
	var newEntry = new ContentfulEntry();
	newEntry.spaceId = json.sys.space.sys.id.toString();
	newEntry.entryId = json.sys.id.toString();
	newEntry.name = json.fields.name.toString();
	newEntry.content = json.fields.content.toString();
	newEntry.description = json.fields.description.toString();
	newEntry.revision = json.sys.revision;
	newEntry.contentfulDateCreated = json.sys.createdAt;
	newEntry.contentfulDateUpdated = json.sys.updatedAt;
	newEntry.dbDateCreated = Date.now;
	
	newEntry.save(function(err) {
		if (!err) {
			console.log("saved new entry to db!");
		}
		else {
			console.log("could not save new entry to db");
		}
	});
};

exports.read = function(_spaceId, _entryId, callback) {	
	ContentfulEntry.findOne({ spaceId : _spaceId, entryId : _entryId }, function(err, doc) {
		if (!err) {
			callback({ message: "", entry: doc });
		}
		else {
			callback({ message: err, entry: null });
		}
	});	
};

exports.update = function(id, json, callback) {
	var newEntry = new ContentfulEntry();
	newEntry.spaceId = json.sys.space.sys.id.toString();
	newEntry.entryId = json.sys.id.toString();
	newEntry.name = json.fields.name.toString();
	newEntry.content = json.fields.content.toString();
	newEntry.description = json.fields.description.toString();
	newEntry.revision = json.sys.revision;
	newEntry.contentfulDateCreated = json.sys.createdAt;
	newEntry.contentfulDateUpdated = json.sys.updatedAt;
	newEntry.dbDateCreated = Date.now;
	
	ContentfulEntry.findById(id, function(err, doc) {
		if (!err && doc) {
			doc.name = newEntry.name;
			doc.content = newEntry.content;
			doc.description = newEntry.description;
			doc.revision = newEntry.revision;
			doc.contentfulDateCreated = newEntry.contentfulDateCreated;
			doc.contentfulDateUpdated = newEntry.contentfulDateUpdated;
			doc.dbDateUpdated = Date.now;
			
			doc.save(function(err) {
				if (!err) {
					console.log("entry updated: %s", id);
				} else {
					console.log("could not update entry: %s", id);
				}
			});
			
		} else if (!err) {
			console.log("could not find entry: %s", id);
		} else {
			console.log("could not update entry: %s", id);
		}
	});
};

exports.delete = function(id) {
	ContentfulEntry.findById(id, function(err, doc) {
		if (!err && doc) {
			doc.remove();
		} else if (!err) {
			console.log("could not find entry: %s", id);
		} else {
			console.log("could not delete entry: %s", id);
		}
	});
};