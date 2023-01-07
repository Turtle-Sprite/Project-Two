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


router.get('/', (req, res) => {
    res.render('tasks/show')
})

// POST //post tasks to database, redirect to goals/:goalId
router.post('/', async (req, res) => {
    try {
        //update tasks database
        // console.log('/goals/',req.body.goalId)
    let newTask = await db.task.create(
        {name: req.body.todo,
        goalId: req.body.goalId})
    //redirect to :/goalId (goalId sent as hidden inputin goals/show POST form)
    res.redirect(`/goals/${req.body.goalId}`)
    } catch (err) {
        console.log('tasks post error', err)
    }
})

//DELETE //delete task from database, redirect to /:goalId
router.delete('/', async (req, res) => {
    console.log(req.body)
    await db.task.destroy({ where: {id: req.body.taskId}})
    //redirect to :/goalId (goalId sent as hidden inputin goals/show Delete form)
    res.redirect(`/goals/${req.body.goalId}`)
})

//PUT / updates tasks where description = complete/incomplete
router.put('/', async (req, res) => {
    try{
    //update the task to complete or incomplete
    let taskUpdate = await db.task.update({
        description: req.body.taskProgress
    }, 
    {where: {id: req.body.taskId} })
    console.log(req.body.taskId)
    res.redirect(`/goals/${req.body.goalId}`)
    } catch (err) {
        console.log("error on /tasks PUT route", err)
    }
})

//export
module.exports = router