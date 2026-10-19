// GitHub repositories the user has linked before, offered on every project page to pick from.

export async function up(knex) {
  await knex.schema.createTable('repositories', (table) => {
    table.increments('id')
    table.string('url').notNullable()
    table.string('owner').notNullable()
    table.string('repo').notNullable()
    table.string('branch').notNullable()
    table.string('path').notNullable().defaultTo('')
    // Milliseconds since 1970 of the last time it was linked, so the list can show the latest first.
    table.bigInteger('linked_at').notNullable()
    table.timestamps(true, true)
    table.unique(['owner', 'repo', 'branch', 'path'])
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('repositories')
}
