module.exports.throwError = (error) => {
	throw new Error(error);
};
module.exports.handleError = (error, req, res, next) => {
	console.log(error);
	res.status(500).json({ message: error.message });
};
