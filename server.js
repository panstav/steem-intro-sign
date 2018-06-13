const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const enforce = require('express-sslify');

const isHeroku = require('@panstav/is-heroku');

const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = initiateServer;

function initiateServer() {

	const server = express();

	// enforce https on production
	if (isProduction) { server.use(enforce.HTTPS({ trustProtoHeader: true }))
	// log routing on local
	} else server.use(morgan('tiny'));

	if (isHeroku) {
		// fix heroku routing forwarding
		server.enable('trust proxy');
	}

	// compress everything
	server.use(compression());

	// serve app
	server.get('/', (req, res) => {
		res.sendFile('index.html', { root: '.', maxAge: 0 });
	});

	// json => req.body
	server.use(bodyParser.json());

	// receive json data of client-side errors and log them
	server.post('/report', (req, res) => {
		console.error('Report', req.body);
		res.status(200).end();
	});

	// handle off-shoots
	server.use(errorHandler, notFound);

	return server;
}