module.exports = errorHandler;

function errorHandler(err, req, res, next){
	console.error(err);
	return res.status(500).end();
}