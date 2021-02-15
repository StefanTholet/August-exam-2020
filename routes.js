const { Router } = require('express');

const productController = require('./controllers/productController');

const authController = require('./controllers/authController');

const router = Router();


router.use('/products', productController);
router.use('/', productController);
router.use('/auth', authController);


module.exports = router;