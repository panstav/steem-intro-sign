module.exports = notFound;

function notFound(req, res){
	res.status(404).end();
}