const express = require('express')
const app = express()
require('dotenv').config({path:"./.env"})
const port = process.env.PORT
const cors = require('cors')
const client = require('./redis')
const userRoutes = require('./Routes/userRoutes')
const projectRoutes = require('./Routes/projectRoutes')
const knex = require('./knex')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cors({origin: process.env.BASE_URL, credentials: true}))
app.use(cookieParser())


app.use('/api/user', userRoutes)

app.use('/api/project' , projectRoutes)


knex
.migrate
.latest()
.then(migration=>{
if (migration) console.log('connected to DB', migration)
app.listen(port, () => {
  console.log(`App listening at ${port}`)
})
}).catch(err => console.log(err))


