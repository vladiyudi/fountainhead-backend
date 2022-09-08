const express = require('express')
const router = express.Router()
const {signup, login} = require('../Controllers/userController')
const {passwordMatch, validateNewUser, validateSignUp, validateLogin, validateEmail, validatePasswordMatch}= require('../Middleware/userMiddleware')
const {makeDonation} = require('../Utils/stripe')
const {signUpSchema, loginSchema} = require('../Schemas/userSchema')
const passport = require('passport')


router.post('/signup', passwordMatch, validateSignUp(signUpSchema), validateNewUser, signup)

router.post('/login',  validateLogin(loginSchema), validateEmail, validatePasswordMatch, login)

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { 
    successRedirect: '/api/user/success',
    failureRedirect: '/api/user/fail' }), 
    )

router.get('/success', (req, res, next)=>{
    req.body.user = req.user[0]
    next()
}, login)

router.get('/fail', (req, res)=>{
    res.send('fail')
}   )

router.get('/logout', (req, res)=>{
        req.logout(err=>{
            if (err) res.send(err)
            res.send('logged out')
        })
    })
  
router.get('/donation', makeDonation)

module.exports = router