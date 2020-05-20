const { Base64 } = require('js-base64');

class CursorService {
	encode(marketId) {
		return Base64.encode(marketId.toString());
	}
	decode(cursor) {
		if (!cursor) return 0;
		return Base64.decode(cursor);
	}
}
module.exports = CursorService;
