const express = require('express');


module.exports = () => {
    const app = express();
    const userAuth = require('./userAuth.js');
    const admin = require('./admin.js');

    app.use('/user_auth', userAuth);
    app.use('/admin', admin);

    return app;
}
