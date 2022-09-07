const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
const client = require('./redis')
const userRoutes = require('./Routes/userRoutes')

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'fountain-head.ch73lyz3kzm0.us-east-1.rds.amazonaws.com',
    user: 'VladiYudi',
    password: process.env.SQL_PWD
})
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MY_SQL!')
})

db.query('CREATE DATABASE IF NOT EXISTS fountainhead', (err, result) => {
    if (err) throw err;
    console.log('Database created')
})

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes)








app.listen(port, () => {
  console.log(`App listening at ${port}`)
})