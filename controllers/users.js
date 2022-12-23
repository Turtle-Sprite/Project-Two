//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

const db = require('../models')

//routes

//GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        //check if user exists/create if not
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
            //TODO: don't add plaintext passwords to the db 
            //this will add the passwod to database if user isn't found
        })
        if (!created) {
           console.log('user exists')
           res.redirect('/users/login?message=Please log in to continue.')     
        } else {
            // here we know it's a new user
            //hash the supplied password
            const hashedPassword = bcrypt.hashSync(req.body.password, 12)
            //save the user with the new password
            newUser.password = hashedPassword
            await newUser.save() //saves the new password in the db
            //encrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(newUser.id), process.env.SECRET)
            const encryptedString = encryptedId.toString()
            //place the encrypted id in a cookie
            res.cookie('userId', encryptedString) //sends cookie to browser, parses it in middleware in index.js
            //redirect to the user's profile
            res.redirect('/users/profile')
        }
        //defunct now that I have hashing and encryted userId and passwords
        //base this on info in req.body (form)
        //TODO: redirect to login page if the user is found
        //log the user in(store the user's id as a cookie in the browser)
        //this will store a key value pair as a cookie
        //must encrypt
        // res.cookie('userId', newUser.id)
        // //redirect to the home page(for now)
        // res.redirect('/')


    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})

// GET / users/login -- render a login form that POsts to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
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

            //if this returns false, rdirect to user login
        } else if(!bcrypt.compareSync(req.body.password, user.password)) {
            //if the user's supplied password is incorrect 
            res.redirect('/users/login?message=' + badCredentialMessage)
            
        } else {
            //if the user is found and their password matches log them in
            console.log('loggin user in')
            res.cookie('userId', user.id)

            //encrypt the new user's id and convert it to a string
            const encryptedId = crypto.AES.encrypt(String(user.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            //place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            res.redirect('/users/profile')
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

// GET / users/profile --showthe user their profile page
router.get('/profile', (req, res) => {
    //if the user is not logged in  -- they are allowed here
    if(!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you can view this resource!')
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

//export
module.exports = router