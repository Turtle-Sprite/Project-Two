// require packages
require('dotenv').config()
const express = require('express')

//app config
const app = express()
//will use the devevlopment port OR port 8010 if its not available
const PORT = process.env.PORT || 8010
app.set('view engine', 'ejs')

//middleware - requests bodies from html forms
app.use(express.urlencoded({ extended: false}))

//routes nd controllers
app.get('/', (req,res) => {
    res.render('home.ejs')
})

app.use("/users", require('./controllers/users'))

//listen on port
app.listen(PORT, () => {
    console.log('authenticating users')
})