module.exports = errorHandler;

function errorHandler(err, req, res, next){
	if (err) {
		console.error('[Server] Report', err);
		return res.status(500).end();
	}

	next();
}