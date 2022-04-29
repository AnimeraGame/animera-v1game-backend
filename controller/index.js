const express = require('express');


module.exports = () => {
    const app = express();
    const userAuth = require('./userAuth.js');
    const admin = require('./admin.js');
    const object = require('./object.js');
    const apis = require('./api.js');
    const race = require('./race.js');

    app.use('/user_auth', userAuth);
    app.use('/admin', admin);
    app.use('/object', object);
    app.use('/api', apis);
    app.use('/race', race);

    return app;
}
