var express = require('express');
const router = express.Router();

const {handleUserAuthPage, handleUserSignin, handleUserSignup ,handleUserLogout ,handleClearFilters} = require('../src/controllers/UserController');

// GET home page
router.get('/', handleUserAuthPage)
router.post('/signup', handleUserSignup)
router.post('/signin', handleUserSignin)
router.get('/logout', handleUserLogout)
router.get('/resetpreferences', handleClearFilters)




module.exports = router;
