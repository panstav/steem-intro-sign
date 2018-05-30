const sinon = require('sinon');
const request = require('supertest');
const assert = require('assert');

const htmlValidator = require('html-validator');

const initiateServer = require('../server');
const server = initiateServer();

describe('Routes', () => {

	describe('/', () => {

		it('Should respond with 200', () => {

			return request(server)
				.get('/')
				.expect(200);

		});

		it('Should return valid html', () => {

			return request(server)
				.get('/')
				.then((res) => validateHtml(res.text));


		});

		it('Should fail if content actually had invalid html', (done) => {

			request(server)
				.get('/')
				.then((res) => {

					validateHtml(res.text.replace(/body/, 'oops'))
						.then(
							() => done(new Error('Did not reject')),
							(err) => done()
						);

				});

		});

		it('Should redirect unknown routes back to /', () => {

			return request(server)
				.get('/a-route-that-surely-does-not-exist')
				.expect(303)
				.then((res) => {
					assert(res.header.location === '/');
				});

		});

	});

	describe('/report', () => {

		it('Should respond with 200', () => {

			sinon.replace(console, 'error', () => {});

			return request(server)
				.post('/report')
				.expect(200)
				.then(() => sinon.restore());

		});

		it('Should error log the reported data', () => {

			const fake = sinon.fake();
			const data = { one: 'two' };

			sinon.replace(console, 'error', fake);

			return request(server)
				.post('/report')
				.send(data)
				.then(() => {
					assert(fake.calledOnce);
					assert.deepStrictEqual(fake.lastArg, data);
					sinon.restore();
				});

		});

	});

});

function validateHtml(html) {

	return htmlValidator({ data: html })
		.then((data) => {
			const result = JSON.parse(data);
			if (result.messages.length) throw new Error(JSON.stringify(result.messages));
		});

}