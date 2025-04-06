const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking.controller');
const auth = require('../middlewares/authMiddleware'); 

router.get('/' ,parkingController.getAllParkings);
router.get('/:id',auth,parkingController.getParkingById);
router.post('/', auth, parkingController.createParking);
router.put('/:id',auth,parkingController.updateParking);
router.delete('/:id',auth,parkingController.deleteParking);

module.exports = router;