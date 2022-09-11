const passport = require('passport')
require('dotenv').config({path:"./.env"})
const knex = require('./knex')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/user/google/callback"
  },
  
  async function(accessToken, refreshToken, profile, cb) {
   const user = await knex('users').where('email', profile.emails[0].value)
   if (!user.length) {
      const newUser = await knex('users').insert({
        email: profile.emails[0].value,
        password: profile.id,
        name: profile.name.givenName,
        avatar: profile.photos[0].value,
        bio: '',
        role: 'student'
      })
      return cb(null, {id: newUser[0], name: profile.name.givenName, email: profile.emails[0].value, password: profile.id, avatar: profile.photos[0].value, bio: '', role: 'student'})
   } else return cb(null, user)
  }
));

passport.serializeUser(function(user, cb){
cb(null, user)
})

passport.deserializeUser(function(user, cb){
cb(null, user)
})