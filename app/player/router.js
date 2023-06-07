var express = require('express');
var router = express.Router();
const { landingPage, detailPage, categoryPage, checkoutPage, historyPage, historyDetailPage, dashboardPage, profilePage, editProfilePage } = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');
const multer = require('multer');
const os = require('os');

/* GET home page. */
router.get('/landingpage', landingPage);

router.get('/:id/detail', detailPage);
router.get('/category', categoryPage);
router.get('/history', isLoginPlayer, historyPage);
router.get('/history/:id/detail', isLoginPlayer, historyDetailPage);
router.get('/dashboard', isLoginPlayer, dashboardPage);
router.get('/profile', isLoginPlayer, profilePage);

router.post('/checkout', isLoginPlayer, checkoutPage);
router.put('/profile', isLoginPlayer, multer({dest: os.tmpdir()}).single('image'), editProfilePage);



module.exports = router;
