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
        const [newGoal, createdGoal] = await db.goal.findOrCreate({
            where: {
                name: req.body.name.toLowerCase()
            }, 
            defaults: {
            description: req.body.description,
            due_date: req.body.dueDate
            }
        })
        // console.log(newGoal)
        //if goal exists, redirect to goals page
        if (!createdGoal) {
            
            res.redirect('goals/new')
        } else {
            // if we create a new goal, redirect to that page here
            res.redirect(`goals/${newGoal.id}`)
        }
    } catch (err) {
        console.log('this is a goal post error', err)
    }
})

// GET // /:goalId shows a specific page for a goal by the db ID and URL number
router.get('/:goalId', async (req,res) => {
    // console.log(res.locals.user)
    try {
        
        let user = await res.locals.user.email
        let goal = await db.goal.findOne({
            where: { id: req.params.goalId }
        })
        
        //make sure there is a goal with that id
        if(goal.id) {
             //make sure they're logged in
            if(user) {
                res.render('goals/show.ejs', {
                    user: user,
                    goal: goal,
                    message: req.query.message ? req.query.message : null
                })
            } else {
                res.redirect('/users/login?message=You must authenticate before you can view this resource!')
            }
        } else {
            //if goalId is invalid, redirect to the profile page
            res.redirect('/users/login?message=That goal doesn\'t exist in our database. Please choose an existing goal. ')
        }

    }catch (err) {
        console.log('Error on /goalsid', err )
    }
})

//GET // //:goalId/edit shows the edit form - redirect to /:goalId in PUT route
router.get('/:goalId/edit', async (req,res) =>{
    let user = await res.locals.user.email
    let goal = await db.goal.findOne({
        where: { id: req.params.goalId }
    })
    if (!user) {
        res.redirect('/users/login?message=Please log in to continue.')
    } else {
        res.render('goals/edit.ejs', {
            user: user,
            goal: goal,
        })
    }
})

//  PUT // /:goalId updates a goal's progress - redirects to /:goalsId 
router.put('/:goalId', async (req,res) => {
    try{
        let user = await res.locals.user.email
        let goal = await db.goal.findOne({
            where: { id: req.params.goalId }
        })
        //make sure the goal exists
        // console.log('goal id', goal.id)
        if(goal.id) {
            //make sure they're logged in
            // console.log('user info', user)
           if(user) {
                let goalUpdate = await db.goal.update({
                    name: req.body.name,
                    description: req.body.description,
                    img_url: req.body.img_url,
                    due_date: req.body.dueDate
                },
                {
                where: {id: req.params.goalId }
            })
               res.render(`goals/show.ejs`, {
                   user: user,
                   goal: goal,
               })
           } else {
               res.redirect('/users/login?message=You must authenticate before you can view this resource!')
           }
       } else {
           //if goalId is invalid, redirect to the profile page
           res.redirect('/users/login?message=That goal doesn\'t exist in our database. Please choose an existing goal. ')
       }

    } catch (err){
        console.log(err)
    }
})

// DELETE // /:goalId deletes a goals from the database
router.delete('/:goalId', async (req, res) => {
    // let goal = await db.project.findByPk(req.params.goalId)
    await db.goal.destroy({where: {id: req.params.goalId}})
    res.redirect('/users/profile')
})


//export
module.exports = router