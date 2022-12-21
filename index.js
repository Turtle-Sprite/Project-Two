// require packages
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')

//app config
const app = express()
//will use the devevlopment port OR port 8010 if its not available
const PORT = process.env.PORT || 8010
app.set('view engine', 'ejs')

//middleware - requests bodies from html forms
app.use(express.urlencoded({ extended: false}))
//tell express to parse incoming cookies
app.use(cookieParser())

//custom auth middleware that checks the cookies for a user id
// and it finds one, look ip the user in the db
///tell all downstream routes about this user
//this will happen on EVERY route
//res carries the middleware, only the functions have access when they have res
app.use( async (req, res, next) => {
    //every route will know if users are logged in or not
    try{
        //req.cookies.userId - userId comes from users.js where we have res.cookie('userId', newUser.id)
        //req.cookies is like req.body - we haveto request it app.use(cookieParser())
        if (req.cookies.userId ) {
            //the user is logged in, lets find them in the db
            const user = await db.user.findByPk(req.cookies.userId)
            // mount the logged in user on the res.locals
            res.locals.user = user
        } else {
            //set the loggedin user to be null for the conditional rendering 
            res.locals.user = null
        }

        //move to the on the next middleware/route
        next()
    }catch {
        console.log('error in middleware')
        next() //even if error, still need to move on, don't get stuck
    }
})

//(req, res, next) = next means move to next function
app.use((req, res, next) => {
    // console.log('hello from middleware')
        //res.locals are a place that we can put data to share with 'downstream routes'
        //this is great for debugging, req.method = GET/POST etc, req.url = /users/new, etc
        console.log(`incoming request: ${req.method} - ${req.url}`)
        // res.locals.myData = 'hello I am data'
        //invoke next to tell express to go to the next route or middleware, without using next, this will not ever move to next route
        next()
})

//routes and controllers
app.get('/', (req,res) => {
    res.render('home.ejs', {
        user: res.locals.user
    })
    //this will tell if user is signed in
    console.log(res.locals.user)
})

app.use("/users", require('./controllers/users'))

//listen on port
app.listen(PORT, () => {
    console.log('authenticating users')
})