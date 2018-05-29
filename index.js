const initiateServer = require('./server');

const port = process.env.PORT || 3000;

initiateServer().listen(port, () => {
	console.info(`Listening on port ${port}`);
});