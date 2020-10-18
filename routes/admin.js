const express = require('express');
const router = express.Router();

const isAuth = require('../utility/isAuth');
const locals = require('../utility/locals');

const adminController = require('../controllers/admin');

router.get('/', locals, isAuth, adminController.getIndex);

router.get('/products', locals, isAuth, adminController.getProducts);

router.get('/add-product', locals, isAuth, adminController.getAddProduct);

router.post('/add-product', locals, isAuth, adminController.postAddProduct);

router.get('/products/:barcode', locals, isAuth, adminController.getEditProduct);

router.post('/products', locals, isAuth, adminController.postEditProduct);

router.post('/delete-product', locals, isAuth, adminController.postDeleteProduct);

router.get('/orders' , locals, isAuth, adminController.getOrders);

router.get('/canceled' , locals , isAuth , adminController.getCanceledOrders);

router.get('/questions' , locals , isAuth , adminController.getQuestions);

router.get('/add-category', locals, isAuth, adminController.getAddCategory);

router.post('/add-category', locals, isAuth, adminController.postAddCategory);

router.get('/categories', locals, isAuth, adminController.getCategories);

router.get('/categories/:categoryid', locals, isAuth, adminController.getEditCategory);

router.post('/categories', locals, isAuth, adminController.postEditCategory);

router.post('/delete-category', locals, isAuth, adminController.postDeleteCategory);

router.get('/accounts', locals, isAuth, adminController.getAccounts);


module.exports = router;   