module.exports.throwError = (error) => {
	throw new Error(error);
};
module.exports.handleError = (error, req, res, next) => {
	res.status(error.status).json({ message: error.message });
};
