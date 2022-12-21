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

//export
module.exports = router