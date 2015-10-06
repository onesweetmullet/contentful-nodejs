var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentfulEntrySchema = new Schema({
	spaceId: { type: String, required: true, trim: true },
	entryId: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	content: { type: String, required: true, trim: true },
	description: { type: String, required: false, trim: true },
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true }
});

var contentfulEntry = mongoose.model('contentfulEntry', contentfulEntrySchema);

module.exports = {
	ContentfulEntry: contentfulEntry
};