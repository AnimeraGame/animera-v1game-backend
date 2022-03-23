const express = require('express');


module.exports = () => {
    const app = express();
    const userAuth = require('./userAuth.js');
    const admin = require('./admin.js');
    const object = require('./object.js');
    const apis = require('./api.js');

    app.use('/user_auth', userAuth);
    app.use('/admin', admin);
    app.use('/object', object);
    app.use('/api', apis);

    return app;
}
