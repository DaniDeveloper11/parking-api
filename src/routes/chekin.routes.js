const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller')
const auth = require('../middlewares/authMiddleware'); 

router.post('/',auth, checkinController.checkIn);

module.exports = router;