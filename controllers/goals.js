//require
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

const db = require('../models')

const API_KEY = process.env.APIKEY

//res.locals.user comes from middleware, tells us if user is logged in and the PK of the user in our database

// GET // users/:userId/goals
