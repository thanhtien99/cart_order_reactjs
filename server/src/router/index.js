const productRouter = require('./product');
const userRouter = require('./users');
const cartRouter = require('./cart');

function route(app) {
   
    app.use('/auth', userRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    
}

module.exports = route;