//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

const db = require('../models')

const API_KEY = process.env.APIKEY

//res.locals.user comes from middleware, tells us if user is logged in and the PK of the user in our database

//GET // / -- form with new goal - Check
router.get('/new', (req,res) =>{
    res.render('goals/new.ejs')
})

// POST // / --create the new goal -- redirect to profile
router.post('/', async (req,res) =>{
    try {
        //find or create a goal
        const [newGoal, createdGoal] = await db.project.findOrCreate({
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
            res.redirect(`/:goal${db.project.id}`)
        // }
    } catch (err) {
        console.log('this is a post error', err)
    }
})

// GET // /:goalsId shows a specific page for a goal by the db ID and URL number
router.get('/:goalsId', async (req,res) => {
    // console.log(res.locals.user)
    try {
        let user = await res.locals.user.email
        let goal = await db.project.findOne({
            where: { id: req.params.goalsId }
        })
        console.log(goal)
        if(res.locals.user) {
            res.render('goals/show.ejs', {
                user: user,
                goal: goal
            })
        } else {
            res.redirect('/users/login?message=You must authenticate before you can view this resource!')
        }

    }catch (err) {
        console.log('Error on /goalsid', err )
    }
})

//  PUT // 


//export
module.exports = router