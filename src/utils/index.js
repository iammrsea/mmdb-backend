module.exports.throwError = (error) => {
	throw new Error(error);
};
module.exports.handleError = (error, req, res, next) => {
	res.status(500).json({ message: error.message });
};
