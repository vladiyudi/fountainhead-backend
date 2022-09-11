 /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

  exports.up = function (knex) {
    return knex.schema.createTable('comments', (table) => {
      table.increments('commentId').primary()
      table.string('projectId')
      table.string('userId')
      table.string('comment')
      table.string('code')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }).then(() => console.log('Table created'))
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('comments')
  };
