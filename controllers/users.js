//require
const express = require('express')
const router = express.Router()

const db = require('../models')

//routes

//GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        //check if user exists/create if not
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            },
            //TODO: don't add plaintext passwords to the db 
            //this will add the passwod to database if user isn't found
            defaults: {
                password: req.body.password
            }
        })
        //base this on info in req.body (form)
        //TODO: redirect to login page if the user is found
        //log the user in(store the user's id as a cookie in the browser)
        //this will store a key value pair as a cookie
        res.cookie('userId', newUser.id)
        //redirect to the home page(for now)
        res.redirect('/')

    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})

// GET / users/login -- render a login form that POsts to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null
    })
})

//POST / users/login -- input data from form renderred @ GET /users/login
router.post('/login', async (req, res) => {
    try {
        // look up user based on email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        //boilerplate messageif login fails
        const badCredentialMessage = 'username or password incorrect'
        if (!user) {
            //if user isn't found in the db
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else if(user.password !== req.body.password) {
            //if the user's supplied password is incorrect 
            res.redirect('/users/login?message=' + badCredentialMessage)
            
        } else {
            //if the user is found and their password matches log them in
            console.log('loggin user in')
            res.cookie('userId', user.id)
            res.redirect('/')
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
    // res.send(' check users credentials against db')
})

// GET /users/logout -- clear any cookies and redirect to the homepage
router.get('/logout', (req, res) => {
    //log the user out by removing the cookie
    res.clearCookie('userId')
    res.redirect('/')
})

//export
module.exports = router