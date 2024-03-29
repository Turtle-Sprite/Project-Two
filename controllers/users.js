//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

const db = require('../models')

const API_KEY = process.env.APIKEY
//routes

//GET /users/new -- serves a form to create a new user
router.get('/', (req, res) => {
    res.render('home.ejs', {
        user: res.locals.user
    })
})

//GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// GET / users/profile --showthe user their profile page
router.get('/profile', async (req, res) => {
    //if the user is not logged in  -- they are allowed here
    if(!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you can view this resource!')
    } else {
        //TODO FindAll all goals associated with this user
        let user = res.locals.user
        // console.log(user)
        let allGoals = await db.goal.findAll({
            where: {userId: user.id}, 
            order: [
                ['due_date', 'ASC']
            ]   
        })
        let allProjects = await db.project.findAll({
            where: {userId: user.id}
        })
        let date = new Date()
        // console.log(allGoals)  
        res.render('users/profile.ejs', {
            user: res.locals.user,
            goal: allGoals ? allGoals : 'No goals, get working!',
            project: allProjects ? allProjects : "No projects, get planning!",
            date: date
        })
    }
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/profile', async (req, res) => {
    try {
        //check if user exists/create if not
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
        })
        //this will add the password to database if user isn't found
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

    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})

// GET / users/login -- render a login form that Posts to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
    })
})

//POST / users/login -- login page -input data from form renderred @ GET /users/login
router.post('/login', async (req, res) => {
    try {
        // look up user based on email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        //boilerplate message if login fails
        const badCredentialMessage = 'username or password incorrect'
        if (!user) {
            //if user isn't found in the db
            res.redirect('/users/login?message=' + badCredentialMessage)

            //if this returns false, redirect to user login
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

//export
module.exports = router