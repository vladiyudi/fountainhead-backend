const passport = require('passport')
require('dotenv').config({path:"./.env"})
const knex = require('../knex')
const { v4: uuidv4 } = require("uuid");

const gitHubStrategy = require('passport-github2').Strategy;

passport.use(new gitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/user/github/callback`
  },
  async function(accessToken, refreshToken, profile, done) {

    const user = await knex('users').where('name', profile.displayName)
    if (!user.length) {
       const newUser = await knex('users').insert({
         email: 'undefined',
         password: profile.id,
         name: profile.displayName,
         avatar: profile.photos[0].value,
         bio: '',
         role: 'student'
       })

       console.log('new user', newUser)

       return done(null, {id: newUser[0], name: profile.displayName, email: 'undefined', password: profile.id, avatar: profile.photos[0].value, bio: ''})
    } else return done(null, user)
  }
));
