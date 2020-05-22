const { Base64 } = require('js-base64');

class CursorService {
	encode(marketId) {
		return Base64.encode(marketId);
	}
	decode(cursor) {
		if (!cursor) return 0;
		return Base64.decode(cursor);
	}
	static getInstance() {
		return new CursorService();
	}
}
module.exports = CursorService;
