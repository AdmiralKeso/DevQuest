// Steps are only kept in the browser (localStorage) now; the database saves which projects were finished.

export async function up(knex) {
  await knex.schema.createTable('completed_projects', (table) => {
    table.string('project_id').primary()
    table.timestamp('completed_at').defaultTo(knex.fn.now())
  })
  await knex.schema.dropTableIfExists('progress')
}

export async function down(knex) {
  await knex.schema.createTable('progress', (table) => {
    table.increments('id')
    table.string('project_id').notNullable()
    table.string('step_id').notNullable()
    table.timestamp('completed_at').defaultTo(knex.fn.now())
    table.unique(['project_id', 'step_id'])
  })
  await knex.schema.dropTableIfExists('completed_projects')
}
