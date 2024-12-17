const userRouter = require('./users');

function route(app) {
   
    app.use('/auth', userRouter);
}

module.exports = route;