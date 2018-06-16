module.exports = notFound;

function notFound(req, res){

	if (req.accepts('html') && !req.url.includes('favicon')) {
		return res.redirect(303, '/');
	}

	res.status(404).end();
}