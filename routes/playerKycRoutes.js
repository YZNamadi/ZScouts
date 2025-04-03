const { playerInfo } = require('../controllers/playerKycController');
const playerController = require('../controllers/playerController');
const upload = require('../utils/multer');

const router = require('express').Router();

router.post('/scoutkyc/:id', upload.single('media'), playerInfo);

module.exports = router