
// IMPORTS // 
const express = require('express') 
const bodyParser = require('body-parser') 
const mongoose = require('mongoose') 
const mongoSanitize = require('express-mongo-sanitize') 
const helmet = require("helmet") 
const sauceRoutes = require('./routes/sauce') 
const userRoutes = require('./routes/user') 
const apiLimiter = require("./middleware/api-limiter") 
const path = require('path') /

mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@${process.env.CLUSTER_DB}.5e9cf.mongodb.net/${process.env.DATA_BASE_NAME}?retryWrites=true&w=majority`,
     {
          useNewUrlParser: true,
          useUnifiedTopology: true
     }
)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express() // Creating the API

app.use((req, res, next) => { // adding headers to personalized the accesses to our API 
     res.setHeader('Access-Control-Allow-Origin', '*') 
     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
     next();
})

app.use(bodyParser.json({ limit: "1kb" })) // parsing the request and limiting its size 
app.use(mongoSanitize()) // sanitizing the request to prevent injection attacks 
app.use(helmet()) // 

//part for the files 
app.use('/images', express.static(path.join(__dirname, 'images'))) // telling to express where to find and stock the files that will be sent and get 
// all the routes
app.use('/api/sauces', apiLimiter, sauceRoutes) 
app.use('/api/auth', apiLimiter, userRoutes) 

module.exports = app //On exporte notre constante