// Tables for what the app now keeps in localStorage:
// devquest.progress, devquest.links, devquest.lastProject and devquest.language.

export async function up(knex) {
  // Completed steps per project
  await knex.schema.createTable('progress', (table) => {
    table.increments('id')
    table.string('project_id').notNullable()
    table.string('step_id').notNullable()
    table.timestamp('completed_at').defaultTo(knex.fn.now())
    table.unique(['project_id', 'step_id'])
  })

  // Linked GitHub repository per project
  await knex.schema.createTable('project_links', (table) => {
    table.string('project_id').primary()
    table.string('owner').notNullable()
    table.string('repo').notNullable()
    table.string('branch')
    table.string('path')
    table.timestamps(true, true)
  })

  // Key/value settings such as lastProject and language
  await knex.schema.createTable('settings', (table) => {
    table.string('key').primary()
    table.string('value')
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('settings')
  await knex.schema.dropTableIfExists('project_links')
  await knex.schema.dropTableIfExists('progress')
}
