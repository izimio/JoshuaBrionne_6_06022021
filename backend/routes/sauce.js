const express = require('express') //On importe express
const router = express.Router() //nous créons un routeur Express
const auth = require('../middleware/auth') //On importe notre middleware auth
const multer = require('../middleware/multer-config') //On importe notre middleware multer
const sauceCtrl = require('../controllers/sauce') //On importes nos controllers


// auth is a middleware to protect the connection
router.get('/', auth, sauceCtrl.getAllSauce)
// /api/sauces serait l'URL complète
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce) 
router.put('/:id', auth, multer, sauceCtrl.modifySauce) 
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce) 

// exporting
module.exports = router 