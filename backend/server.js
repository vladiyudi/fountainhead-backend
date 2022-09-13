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

// app.use(cors({ origin: process.env.BASE_URL, credentials: true }))

app.options('/api/user/google', cors(),
(res)=>{
  console.log("here")
}) // enable pre-flight request for DELETE request


// app.options('*', cors(),(req,res)=>{
//   console.log(req);
// }) // include before other routes


// app.use(cors(
//   {
//   origin: 
//   [process.env.BASE_URL, process.env.SERVER_URL],
//    credentials: true, methods: "get, post, put, options"}
//    ))
app.use(cors({credentials: true}));
app.use(cookieParser())

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin" : "http://localhost:3000");
//   next();
// });

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))


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


