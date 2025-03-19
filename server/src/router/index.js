const productRouter = require('./product');
const userRouter = require('./users');
const cartRouter = require('./cart');
const categoryRouter = require('./category');

function route(app) {
   
    app.use('/auth', userRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    app.use('/category', categoryRouter);
    
}

module.exports = route;