const knex = require("knex");
const knexConfig = require("./knexfile");
const dbConnection = knex(knexConfig);

module.exports = dbConnection

// const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//         host: 'fountain-head.ch73lyz3kzm0.us-east-1.rds.amazonaws.com',
//         user: 'VladiYudi',
//         password: process.env.SQL_PWD,
//         database: 'fountainhead',
//         port: 3306
//     }
// })

// knex.schema.withSchema('fountainhead').createTable('users', (table) => {
//     table.increments('id').primary()
//     table.string('name')
//     table.string('email')
//     table.string('password')
// }).then(() => console.log('Table created'))


// knex('users').insert({name: 'Vladi', email: 'test@test.com', password: '123456'}).then(() => console.log('User added'))

// const create = async ()=>{
 
    // await knex.schema.withSchema('fountainhead').createTable('users', (table) => {
    //     table.increments('id').primary()
    //     table.string('name')
    //     table.string('email')
    //     table.string('password')
    // }).then(() => console.log('Table created'))



//     await knex('users').insert({name: 'Kaki', email: 'test@test.com', password: '123456'}).then(() => console.log('User added'))
// }

// create()


// module.exports = knex