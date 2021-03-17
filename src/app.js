const express = require('express')
const cors = require('cors')
const payment = require('./routes/payment')

const app = express()

//Settings
app.set('port', process.env.PORT || 4000)
app.use(express.json())
app.use(cors({ origin: true }))

//Middlewares
app.use(express.urlencoded({extended: false}))


//Routes
//app.use(require('../functions/routes/index'));
app.use('/user', payment)

//Static files
//app.use(express.static(path.join(__dirname, 'public')))


module.exports = app