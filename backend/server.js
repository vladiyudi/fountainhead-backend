const express = require('express')
const app = express()
require('dotenv').config({ path: "./.env" })
const port = process.env.PORT
const cors = require('cors')
const client = require('./redis')
const userRoutes = require('./Routes/userRoutes')
const projectRoutes = require('./Routes/projectRoutes')
const knex = require('./knex')
const cookieParser = require('cookie-parser')
const googleAuth = require('./googleAuth')
const session = require('express-session')
const passport = require('passport')
require('./Utils/gitHubAuth')



app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

app.use(cors({ origin: process.env.BASE_URL, credentials: true }))

app.use(cors({origin: [process.env.BASE_URL, process.env.SERVER_URL], credentials: true}))

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use('/public/projectImg', express.static('public/projectImg'))


app.use('/api/user', userRoutes)
app.use('/api/project', projectRoutes)




knex
  .migrate
  .latest()
  .then(migration => {
    if (migration) console.log('connected to DB', migration)
    app.listen(port, () => {
      console.log(`App listening at ${port} 🔥 `)
    })
  }).catch(err => console.log(err))


