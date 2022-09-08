
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.string('email')
    table.string('lastName')
    table.string('password')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).then(() => console.log('Table created'))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
