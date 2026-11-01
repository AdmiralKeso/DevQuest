// Test the PDF maker from the terminal: makes a progress report and saves it with fs.writeFileSync.
//   node pdfmaker/test.js                 sample projects
//   node pdfmaker/test.js --api           your finished projects from the local API (npm run server first)
//   node pdfmaker/test.js projects.json   projects from a JSON file: [{ "title": "...", "stack": "..." }]
// The PDF is saved in pdfmaker/output/; open it in the browser to see it.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { OBJECTIVES, STACKS } from '../src/data/objectives.js'
import { createProgressPdf } from './pdfMaker.js'

const OUTPUT_DIR = new URL('./output/', import.meta.url)
const API_URL = `http://localhost:${process.env.API_PORT ?? 3001}/api/completed-projects`

const SAMPLE_PROJECTS = [
  { title: 'Build a contact form', stack: 'HTML', difficulty: 'Easy', completedAt: '2026-10-02' },
  { title: 'Fetch a Pokémon from an API', stack: 'JavaScript', difficulty: 'Medium', completedAt: '2026-10-14' },
  { title: 'Build a library database', stack: 'SQL', difficulty: 'Medium', completedAt: '2026-10-28' },
]

// The finished projects saved by the app, with their titles, stacks and difficulties from objectives.js
async function projectsFromApi() {
  let res
  try {
    res = await fetch(API_URL)
  } catch {
    throw new Error(`Server error: can't reach ${API_URL}. Start the API with npm run server.`)
  }
  if (!res.ok) throw new Error(`Server error: ${API_URL} answered ${res.status} ${res.statusText}`)

  const finished = await res.json()
  return finished
    .map(({ projectId, completedAt }) => {
      const project = OBJECTIVES.find((o) => o.id === projectId)
      if (!project) return null // a project that was removed from objectives.js
      const stack = STACKS.find((s) => s.id === project.stack)
      return { title: project.title, stack: stack?.label, difficulty: capitalize(project.difficulty), completedAt }
    })
    .filter(Boolean)
}

function projectsFromFile(path) {
  let text
  try {
    text = readFileSync(path, 'utf8')
  } catch (e) {
    throw new Error(e.code === 'ENOENT' ? `File not found: ${path}` : `Can't read ${path}: ${e.message}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`${path} is not valid JSON`)
  }
}

function capitalize(text) {
  return text ? text[0].toUpperCase() + text.slice(1) : text
}

async function main() {
  const arg = process.argv[2]
  let projects = SAMPLE_PROJECTS
  if (arg === '--api') projects = await projectsFromApi()
  else if (arg) projects = projectsFromFile(arg)

  const pdf = createProgressPdf(projects)
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const file = new URL('devquest-progress.pdf', OUTPUT_DIR)
  writeFileSync(file, pdf)
  console.log(`Saved ${projects.length} finished project(s) to ${fileURLToPath(file)}`)
}

main().catch((e) => {
  console.error(e.message)
  process.exitCode = 1
})
