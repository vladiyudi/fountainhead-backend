const express = require('express')
const router = express.Router()
const {signup, login} = require('../Controllers/userController')
const {passwordMatch, validateNewUser, validateSignUp, validateLogin, validateEmail, validatePasswordMatch}= require('../Middleware/userMiddleware')
const {signUpSchema, loginSchema} = require('../Schemas/userSchema')
const passport = require('passport')
const querystring = require('querystring')

router.post('/signup', passwordMatch, validateSignUp(signUpSchema), validateNewUser, signup)


router.post('/login',  validateLogin(loginSchema), validateEmail, validatePasswordMatch, login)

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))




module.exports = router