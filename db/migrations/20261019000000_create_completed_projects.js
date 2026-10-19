// Finished projects: saved once when every step of a project is done (steps themselves stay in localStorage).

export async function up(knex) {
  await knex.schema.createTable('completed_projects', (table) => {
    table.string('project_id').primary()
    table.timestamp('completed_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('completed_projects')
}
