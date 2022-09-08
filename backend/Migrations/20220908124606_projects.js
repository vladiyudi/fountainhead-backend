/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('projects', (table) => {
        table.increments('id').primary()
        table.string('type')
        table.string('name')
        table.string('info')
        table.string('picture')
        table.string('link')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    }).then(() => console.log('Table created'))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('projects')
};
