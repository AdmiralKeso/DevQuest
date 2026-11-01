import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Loads the shared settings in .env.localhost (the database path and the API port). The file is committed so
// everyone uses the same settings; DevQuest only runs locally, so it holds no secrets. Never put passwords or tokens in it.
dotenv.config({ path: fileURLToPath(new URL('./.env.localhost', import.meta.url)) })
