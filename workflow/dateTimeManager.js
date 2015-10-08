exports.isContentExpired = function(contentDate, maxAge) {
	var _dateDiff = new Date() - contentDate;
	
	// check if it is expired
	if (_dateDiff < maxAge) {
		// not expired
		return false;
	} else {
		// expired
		return true;
	}
}