const express = require('express')
const router = express.Router()
const { signup, login, validateUser, updateUser, uploadUserPicture, uploadToCloudinary, loginWithGoogle, getUserById } = require('../Controllers/userController')
const { passwordMatch, validateNewUser, validateSignUp, validateLogin, validateEmail, validatePasswordMatch, auth } = require('../Middleware/userMiddleware')
const { makeDonation } = require('../Utils/stripe')
const { signUpSchema, loginSchema } = require('../Schemas/userSchema')
const passport = require('passport')
const { update } = require('jugglingdb/lib/model')

router.get('/validate', auth, validateUser)

router.get('/donation', makeDonation)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/success', (req, res, next) => {
    req.body.user = req?.user[0]
    next()
}, loginWithGoogle )


router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) res.send(err)
        res.send('logged out')
    })
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/githubsuccess', (req, res, next) => {
    req.body.user = req?.user[0]
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

// router.get('/logout', (req, res) => {
//     console.log('logout')
//     req.logout(err => {
//         if (err) res.send(err)
//         res.send('logged out')
//     })
// })

// router.get('/donation', auth, makeDonation)



router.patch('/updatePicture',
    uploadUserPicture,
    auth,
    uploadToCloudinary,
)

router.patch('/updateMe' , auth  , updateUser)

module.exports = router