var mongoose = require("mongoose");
var ContentfulEntry = require("../models/contentfulEntry").ContentfulEntry;

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

exports.save = function(data, callback) {	
	var _newEntry = {
		spaceId : data.sys.space.sys.id.toString(),
		entryId : data.sys.id.toString(),
		name : data.fields.name.toString(),
		content : data.fields.content.toString(),
		description : data.fields.description.toString(),
		revision : data.sys.revision,
		contentfulDateCreated : data.sys.createdAt,
		contentfulDateUpdated : data.sys.updatedAt,
		dbDateUpdated : Date.now() 	
	};
		
	ContentfulEntry.findOneAndUpdate({ spaceId: _newEntry.spaceId, entryId: _newEntry.entryId}, _newEntry, { upsert:true }, function(err, doc) {
		if (!err && doc) {
			callback({ message: "", entry: doc });
		} else if (!err && !doc) {
			ContentfulEntry.findOne({ spaceId: _newEntry.spaceId, entryId: _newEntry.entryId}, function(err, doc) {
				if (!err && doc) {
					callback({ message: "", entry: doc });
				} else {
					callback({ message: "could not find new entry after insert", entry: null });
				}
			});
		} else {
			callback({ message: "could not upsert entry", entry: null });
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