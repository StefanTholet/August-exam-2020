const { Router } = require('express');

const isAuthenticated = require('../middlewares/isAuthenticated');

const productService = require('../services/productService');

const errorCompiler = require('./helpers/errorCompiler');

const router = Router();

const Product = require('../models/Product')

router.get('/', (req, res) => {
    productService.getAll()
        .then(products => {
            const sortedProducts = products
                .sort((a, b) => {
                    return b.buyers.length - a.buyers.length;
                });
            if (res.locals.isAuthenticated) {
                res.render('./users/home', { title: 'Browse', sortedProducts })
            } else {
                res.render('./guests/home', { title: 'Browse', sortedProducts });
            }
        })
        .catch((error) => {
            console.log(error);
            res.end();
        })
});

router.get('/products/create', isAuthenticated, (req, res) => {
    res.render('./users/create', { title: 'Add a product' });
});

router.post('/products/create', isAuthenticated, (req, res) => {
    let today = new Date();
    req.body.createdOn = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    productService.create(req.body, req.user._id)
        .then((createdProduct) => {
            productService.updateDbArray(User, req.user._id, 'offers', String(createdProduct._id))
            res.redirect('/')
        })
        .catch((err) => {
            const errors = errorCompiler(err);
            res.render('./users/create', errors)
        })
});

router.get('/products/:productId/details', isAuthenticated, (req, res) => {
    productService.getOne(req.params.productId)
        .then(product => {
            if (req.user._id == String(product.creator._id)) {
                product.isCreator = true;
            }
            if (product.buyers.includes(req.user._id)) {
                product.bought = true;
            }
            product.sales = product.buyers.length;
            res.render('./users/details', { title: 'Product Details', product })
        })
        .catch(err => { throw err });
});


router.get('/products/:productId/edit', isAuthenticated, (req, res) => {
    productService.getOne(req.params.productId)
        .then(product => {
            res.render('./users/edit', { title: 'Edit Product', product });
        })
        .catch(err => { throw err });
});

router.post('/products/:productId/edit', isAuthenticated, (req, res) => {
    productService.updateOne(req.params.productId, req.body)
        .then(response => {
            res.redirect(`/products/${req.params.productId}/details`);
        })
        .catch(err => { throw err });
});


router.get('/products/:productId/delete', isAuthenticated, (req, res) => {
    console.log('y')
    productService.getOne(req.params.productId)
        .then(product => {
         productService.deleteOne(String(product._id))
        }).then((response => res.redirect('/')))
        .catch(err => { throw err });
});



//bonuses

router.get('/users/:_id/profile', (req, res) => {
    productService.getAllSold(req.params._id)
        .then(products => {
            const user = req.user;
            user.totalProfit = products.reduce((totalProfit, product) => {
                totalProfit += product.price;
                return totalProfit;
            }, 0);
            user.offers = products.reduce((offers, product) => {
                offers += product.buyers.length;
                return offers
            }, 0);
            res.render('./users/profile', {user, products});
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send('Not Found')
        })
   
})

router.get('/products/:productId/buy', (req, res) => {
    const id = req.params.productId;
    const buyerId = req.user._id;
    productService.updateDbArray(Product, id, 'buyers', buyerId)
        .then(result => {
            res.redirect(`/products/${id}/details`);
        })

});

module.exports = router;
