//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

const db = require('../models')
const { where } = require('sequelize')
const { application } = require('express')

const API_KEY = process.env.APIKEY

// GET / "/" all projects
router.get('/', (req, res)=> {

})
// GET / /new form for creating a project
router.get('/new', async (req, res)=> {
    try {
        let user = await res.locals.user
        if(user) {
            res.render('projects/new', {
                user: user,
                message: req.query.message ? req.query.message : null,
            })
        } else {
            res.redirect('/users/login?message=You must authenticate before you can view this resource!')
        }
    } catch(err) {
        console.log('/get/new form', err)
    }
})

//GET / /:projectId - show page for a specific project
router.get('/:projectId', (req, res)=> {
    
})

//POST /:projectId
router.post('/', async (req, res)=> {
    try {
        //find or create a project
        const [newProject, created] = await db.project.findOrCreate({
            where: {
                name: req.body.name
            }, 
            defaults: {
            description: req.body.description,
            img_url: "https://images.unsplash.com/photo-1597211165861-29ef11229300?crop=entropy&cs=tinysrgb&fit=max&fm=jpgixid=MnwzOTIwODh8MHwxfHNlYXJjaHwzfHx1bmRlZmluZWR8ZW58MHx8fHwxNjcyODg1MjA4&ixlib=rb-4.0.3&q=80&w=1080&fm=jpg&w=200&fit=max&h=150",
            due_date: req.body.dueDate,
            complete: "Not-started",
            public: req.body.public,
            userId: res.locals.user.id
            }
        })
        // console.log(newGoal)
        //if goal exists, redirect to goals page
        if (!created) {
            res.redirect('projects/new')
        } else {
            // if we create a new goal, redirect to that page here
            res.redirect(`projects/${newProject.id}`)
        }
    } catch (err) {
        console.log('this is a project POST error', err)
    }
})

//export
module.exports = router