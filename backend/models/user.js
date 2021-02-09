const mongoose = require('mongoose') 
const uniqueValidator = require('mongoose-unique-validator') //importing unique validator to avoid duplicate

const userSchema = mongoose.Schema({ // creating the differents types of input we wants for the user 
     email: { type: String, required: true, unique: true }, 
     password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator) //applying the unique validator
 
//exporting
module.exports = mongoose.model('User', userSchema)