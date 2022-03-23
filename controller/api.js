const {
    _,
    routes,
    translation,
} = require('../services/baseService.js');

routes.get('/healthz', async (req, res) => {
    const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}
});

module.exports = routes;