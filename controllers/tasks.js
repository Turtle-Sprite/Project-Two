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
        console.log('/goals/',req.body.goalId)
    let [newTask, created] = await db.task.findOrCreate({
        where: {name: req.body.todo},
        defaults: {
            goalId: req.body.goalId
        }
    })
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

//export
module.exports = router