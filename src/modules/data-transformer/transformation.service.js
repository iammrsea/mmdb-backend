const CursorService = require('../cursor/cursor.service');
class TransformationService {
	transform({ data, limit }) {
		const hasNext = !!data[limit];
		const nextCursor = this._getNextCursor(data, limit);
		const _data = this._getData(data, limit);

		return { data: _data, meta: { hasNext, nextCursor } };
	}
	_getNextCursor(data, limit) {
		const _nextDataItem = data[limit];
		if (_nextDataItem) {
			return new CursorService().encode(data[data.length - 1]._id);
		}
		return '';
	}
	_getData(data, limit) {
		const _nextDataItem = data[limit];
		if (_nextDataItem) {
			return data.filter((dataItem) => dataItem._id !== _nextDataItem._id);
		}
		return data;
	}
}

module.exports = TransformationService;
