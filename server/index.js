import 'dotenv/config'
import express from 'express'
import knex from 'knex'
import config from '../knexfile.js'

// Local API for the app. Saves finished projects and linked repositories in the SQLite database; no users, it only runs on your own machine.
const db = knex(config[process.env.NODE_ENV || 'development'])
await db.migrate.latest()

const app = express()
app.use(express.json())

// Finished projects (every step done), first finished first: [{ projectId, completedAt }]
app.get('/api/completed-projects', async (req, res) => {
  const rows = await db('completed_projects').select('project_id', 'completed_at').orderBy('completed_at')
  res.json(rows.map((row) => ({ projectId: row.project_id, completedAt: row.completed_at })))
})

// Saves that a project was finished. Saving it again keeps the first completed_at.
app.post('/api/completed-projects/:projectId', async (req, res) => {
  const { projectId } = req.params
  await db('completed_projects').insert({ project_id: projectId }).onConflict('project_id').ignore()
  const saved = await db('completed_projects').where('project_id', projectId).first()
  res.json({ projectId, completedAt: saved.completed_at })
})

// Saved repositories, most recently linked first.
app.get('/api/repositories', async (req, res) => {
  const rows = await db('repositories')
    .select('id', 'url', 'owner', 'repo', 'branch', 'path')
    .orderBy('linked_at', 'desc')
  res.json(rows)
})

// Saves a repository after it was linked. Body: { url, owner, repo, branch, path }
// Linking the same repository (and branch/folder) again only moves it to the top of the list.
app.post('/api/repositories', async (req, res) => {
  const { url, owner, repo, branch, path = '' } = req.body ?? {}
  if (![url, owner, repo, branch, path].every((value) => typeof value === 'string') || !url || !owner || !repo || !branch) {
    return res.status(400).json({ error: 'Body must be { url, owner, repo, branch, path }' })
  }

  const linkedAt = Date.now()
  await db('repositories')
    .insert({ url, owner, repo, branch, path, linked_at: linkedAt })
    .onConflict(['owner', 'repo', 'branch', 'path'])
    .merge({ url, linked_at: linkedAt, updated_at: db.fn.now() })
  const saved = await db('repositories')
    .select('id', 'url', 'owner', 'repo', 'branch', 'path')
    .where({ owner, repo, branch, path })
    .first()
  res.json(saved)
})

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

const port = Number(process.env.API_PORT) || 3001
app.listen(port, () => console.log(`DevQuest API on http://localhost:${port}`))
