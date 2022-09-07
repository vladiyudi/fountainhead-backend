const express = require('express')
const router = express.Router()
const {signup} = require('../Controllers/userController')
const {passwordMatch, validateNewUser}= require('../Middleware/userMiddleware')

router.post('/signup', passwordMatch,  validateNewUser, signup)

module.exports = router