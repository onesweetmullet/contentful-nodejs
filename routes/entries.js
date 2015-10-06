var ContentfulEntry = require('../models/contentfulEntry').ContentfulEntry;

exports.index = function(req, res) {
	//res.json(200, { message: "howdy! "});
	ContentfulEntry.find({}, function(err, docs) {
		if (!err) {
			res.json(200, { entries: docs });
		} else {
			res.json(500, { message: err });
		}
	});
}