const express = require('express') 
const router = express.Router() 
const auth = require('../middleware/auth') 
const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce') 


// auth is a middleware to protect the connection
// normally /api/sauce would be the default but here we can reduce it to / 

router.get('/', auth, sauceCtrl.getAllSauce)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce) 
router.put('/:id', auth, multer, sauceCtrl.modifySauce) 
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce) 

// exporting
module.exports = router 