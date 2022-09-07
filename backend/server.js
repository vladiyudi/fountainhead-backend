const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
const client = require('./redis')
const userRoutes = require('./Routes/userRoutes')
const knex = require('./knex')



app.use(express.json())
app.use(cors())
app.use('/api/user', userRoutes)

// const create = async ()=>{
//   knex('users').insert({name: 'Debi', email: 'debi@test.com', password: '1234156'}).then(() => console.log('User added'))
// }


// create()

knex
.migrate
.latest()
.then(migration=>{
if (migration) console.log('connected to DB', migration)
app.listen(port, () => {
  console.log(`App listening at ${port}`)
})
}).catch(err => console.log(err))


