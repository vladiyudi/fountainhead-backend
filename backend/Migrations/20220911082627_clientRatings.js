/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


 exports.up = function (knex) {
    return knex.schema.createTable('clientsVotes', (table) => {
      table.increments('ratingId').primary()
      table.string('projectId')
      table.string('avgCreativity')
      table.string('avgBestPractices')
      table.string('avgDesign')
      table.string('avgBugs')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }).then(() => console.log('Table created'))
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('clientsVotes')
  };
