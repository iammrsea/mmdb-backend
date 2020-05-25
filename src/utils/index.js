module.exports.throwError = (error) => {
	throw new Error(error);
};
module.exports.handleError = (error, req, res, next) => {
	res.send({ message: error.message, error });
};
