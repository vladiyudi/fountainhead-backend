const express = require('express')
const router = express.Router()
const { signup, login, validateUser, updateUser, uploadUserPicture, uploadToCloudinary, loginWithGoogle, getUserById, updateRole } = require('../Controllers/userController')
const { passwordMatch, validateNewUser, validateSignUp, validateLogin, validateEmail, validatePasswordMatch, auth } = require('../Middleware/userMiddleware')
const { makeDonation } = require('../Utils/stripe')
const { signUpSchema, loginSchema } = require('../Schemas/userSchema')
const passport = require('passport')
const { update } = require('jugglingdb/lib/model')

router.get('/validate', auth, validateUser)

router.get('/donation', makeDonation)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/success', (req, res, next) => {
    const { user } = req
    if (user[0])  req.body.user = user[0]
    else req.body.user = user
    next()
}, loginWithGoogle )


router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) res.send(err)
        res.send('Logged out')
    })  
   
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/githubsuccess', (req, res, next) => {
    const { user } = req
    if (user[0])  req.body.user = user[0]
    else req.body.user = user
    next()
}, loginWithGoogle)

router.get('/:userId', getUserById)

router.post('/signup', passwordMatch, validateSignUp(signUpSchema), validateNewUser, signup)

router.post('/login', validateLogin(loginSchema), validateEmail, validatePasswordMatch, login)

router.get(`/github/callback`,
    passport.authenticate('github', {
        successRedirect: '/api/user/githubsuccess',
        failureRedirect: '/login'
    }),
);

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/api/user/success',
    failureRedirect: '/api/user/fail'
}),
)

router.get('/fail', (req, res) => {
    res.send('fail')
})

router.patch('/updatePicture',
    uploadUserPicture,
    auth,
    uploadToCloudinary,
)

router.patch('/updateMe' , auth  , updateUser)


module.exports = router