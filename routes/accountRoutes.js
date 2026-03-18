const router = require('express').Router();
const auth = require('../middleware/authmiddleware');
const { getBalance } = require('../controllers/accountcontroller');

router.get('/balance', auth, getBalance);

module.exports = router;