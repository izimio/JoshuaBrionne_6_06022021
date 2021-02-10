const Sauce = require('../models/Sauce')
const fs = require('fs')

//creating sauce
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id //deletting frondtend's sauce ID
    const sauce = new Sauce({ //On créé une nouvelle instance de notre modele Sauce
        ...sauceObject, //spreading the req.body all over the brand new sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //modyfing the image's URL
    })
    sauce.save() //saving the sauce 
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

exports.modifySauce = (req, res) => {
    if(req.file){
        Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // deleting the linked file
            fs.unlink(`images/${filename}`, () => {
            })
        })
    }
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    } // copying req body
    //updating the sauce we wants
    Sauce.updateOne({
        _id: req.params.id
    }, {
        ...sauceObject,
        _id: req.params.id
    })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

exports.likeSauce = (req, res) => {
    const sauceObject = req.body
    const userId = sauceObject.userId
    const like = sauceObject.like

    Sauce.findOne({
        _id: req.params.id
    }) //getting item's ID
        .then((sauce) => {
            if (like == 1) {
                sauce.usersLiked.push(userId) //push likes
                sauce.likes++
            } else if (like == -1) {
                sauce.usersDisliked.push(userId)
                sauce.dislikes++
            } else if (like == 0 && sauce.usersLiked.includes(userId)) {
                sauce.likes--
                let arr = sauce.usersLiked.indexOf(userId)
                sauce.usersLiked.splice(arr, 1)
            } else if (like == 0 && sauce.usersDisliked.includes(userId)) {
                sauce.dislikes--
                let arr = sauce.usersDisliked.indexOf(userId)
                sauce.usersDisliked.splice(arr, 1)
            }
            // updating the sauce now 
            Sauce.updateOne({
                _id: req.params.id
            }, {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                dislikes: sauce.dislikes,
                likes: sauce.likes,
                _id: req.params.id
            })
                .then(() => res.status(200).json({
                    message: 'Objet modifié !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(400).json({
            error
        }));
}
// deleting a sepcific sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // deleting the linked file
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({  // deleting the sauce 
                    _id: req.params.id
                })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }))
            })
        })
        .catch(error => res.status(500).json({
            error: 'erreur 500 sauce'
        }))
}

exports.getOneSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }) //finding the sauce matching with the Id
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            })
        })
}

exports.getAllSauce = (req, res) => {
    Sauce.find() // finding all sauces and returning them inside an arr
        .then((sauces) => {
            res.status(200).json(sauces)
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        })
}