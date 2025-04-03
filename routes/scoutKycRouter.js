
const scoutAuthController = require('../controllers/scoutController');
const { scoutInfo } = require('../controllers/scoutKycController');
const upload = require('../utils/multer');

const router = require('express').Router();

router.post('/scoutkyc/:id', upload.single('verificationDocument'), scoutInfo);




module.exports = router