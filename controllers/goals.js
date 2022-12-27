//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

const db = require('../models')

const API_KEY = process.env.APIKEY

//res.locals.user comes from middleware, tells us if user is logged in and the PK of the user in our database
//

//GET // / -- form with new goal
router.get('/', (req,res) =>{
    res.render('goals/new.ejs')
})

// POST // / --create the new goal
router.post('/', async (req,res) =>{
    try {
        //find or create a goal
        const [newGoal, createdGoal] = await db.goal.findOrCreate({
            where: {
                name: req.body.name.toLowerCase()
            }, 
            defaults: {
            description: req.body.description,
            due_date: req.body.dueDate
            }
        })
        //if goal exists, redirect to goals page
        // if (!createdGoal) {
        //     res.redirect('users/profile/?message=That goal already exists.')
        // } else {
            //if we create a new goal, redirect to that page here
            res.redirect(`/user/profile`)
        // }
    } catch (err) {
        console.log('this is a post error', err)
    }
})

// GET // /:goalsId shows a specific page for a goal
router.get('/:goalsId', async (req,res) => {
    // console.log(res.locals.user)
    let user = res.locals.user.email

    if(res.locals.user) {
        res.render('goals/show.ejs', {
            user: user
        })
    } else {
        res.redirect('/users/login?message=You must authenticate before you can view this resource!')
    }
})



//export
module.exports = router