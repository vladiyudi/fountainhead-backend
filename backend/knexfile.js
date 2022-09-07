const path = require('path')

const pathToMigrations = path.resolve(__dirname, './Migrations')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'mysql',
    connection: {
        host: 'fountain-head.ch73lyz3kzm0.us-east-1.rds.amazonaws.com',
        user: 'VladiYudi',
        password: process.env.SQL_PWD,
        database: 'fountainhead',
        port: 3306   
},
pool: {
  min: 2,
  max: 10,
},
migrations: {
  tableName: "knex_migrations",
  directory: pathToMigrations,
},


};
