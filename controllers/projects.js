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

//GET / /all- show page for all projects
router.get('/all', async (req, res)=> {
    try {
        let user = await res.locals.user
        let project = await db.project.findAll({
            include: [db.goal]
        })
        console.log(project)
        if(user) {
            res.render(`projects/allprojects`, {
                user: user,
                project: project,
                message: req.query.message ? req.query.message : null,
            })
        } else {
            res.redirect('/users/login?message=You must authenticate before you can view this resource!')
        }
    } catch(err) {
        console.log('/get /all projects', err)
    }
})

//GET / /:projectId - show page for a specific project
router.get('/:projectId', async (req, res)=> {
    try {
        let user = await res.locals.user
        let project = await db.project.findOne({
            where: {id: req.params.projectId},
            include: [db.goal]
        })
        console.log(project.goals)
        if(user) {
            res.render(`projects/show`, {
                user: user,
                project: project,
                message: req.query.message ? req.query.message : null,
            })
        } else {
            res.redirect('/users/login?message=You must authenticate before you can view this resource!')
        }
    } catch(err) {
        console.log('/get/new form', err)
    }
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
            progress: "Not-started",
            public: req.body.public,
            userId: parseInt(res.locals.user.id)
            }, 
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

//GET /:projectId/photo
router.get('/:projectId/photo', async (req, res) =>{
    let search = req.query.photoSearch
    const img_url = `https://api.unsplash.com/search/photos?client_id=${API_KEY}&page=1&query=${req.query.photoSearch}`
    const response = await axios.get(img_url, {
        headers: {"Accept-Encoding": "gzip,deflate,compress"}
    })
    let project = await db.project.findOne({
        where: { id: req.params.projectId }
    })
    console.log(project)
    res.render('projects/photo', {
        project: project,
        photo: response.data.results
    })
})

//POST /:projectId/photo
router.post('/:projectId/photo', async (req, res) =>{
    try {
        console.log(req.body)
        let project = await db.project.findOne({
            where: { id: req.params.projectId }
            })
        await project.update(
        {img_url: req.body.images},
        {where: {id: req.params.projectId}}
        )
        res.redirect(`/projects/${project.id}`)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

//export
module.exports = router