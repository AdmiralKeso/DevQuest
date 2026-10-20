// SQL sync for projects that are written in the SQL text box on the project page instead of a GitHub repository.
// readSql splits the SQL into statements (comments left out, semicolons inside quotes ignored) and gives each a
// type, e.g. "create table", "insert", "select"; detectSqlSteps ticks the steps whose `check` rules match them.

// Statement types, checked in order on the start of a statement (WITH ... SELECT counts as a select)
const TYPES = [
  ['create table', /^create\s+(temp(orary)?\s+)?table\b/],
  ['create index', /^create\s+(unique\s+)?index\b/],
  ['create view', /^create\s+view\b/],
  ['alter table', /^alter\s+table\b/],
  ['drop table', /^drop\s+table\b/],
  ['drop index', /^drop\s+index\b/],
  ['insert', /^insert\b/],
  ['select', /^(select|with)\b/],
  ['update', /^update\b/],
  ['delete', /^delete\b/],
  ['begin', /^begin\b|^start\s+transaction\b/],
  ['commit', /^(commit|end)\b/],
  ['rollback', /^rollback\b/],
]

function typeOf(text) {
  const start = text.toLowerCase()
  return TYPES.find(([, pattern]) => pattern.test(start))?.[0] ?? start.split(/\s/)[0]
}

// Returns [{ type, text }] for every statement, with comments removed and whitespace collapsed.
export function readSql(sql) {
  const statements = []
  let current = ''
  let i = 0
  while (i < sql.length) {
    const char = sql[i]
    const next = sql[i + 1]
    if (char === '-' && next === '-') {
      // Line comment: skip to the end of the line
      while (i < sql.length && sql[i] !== '\n') i++
      current += ' '
    } else if (char === '/' && next === '*') {
      // Block comment: skip to */
      const end = sql.indexOf('*/', i + 2)
      i = end === -1 ? sql.length : end + 2
      current += ' '
    } else if (char === "'" || char === '"' || char === '`') {
      // String or quoted name: copy it whole, so a ; or -- inside doesn't count ('' is an escaped quote)
      let end = i + 1
      while (end < sql.length && !(sql[end] === char && sql[end + 1] !== char)) end += sql[end] === char ? 2 : 1
      current += sql.slice(i, end + 1)
      i = end + 1
    } else if (char === ';') {
      statements.push(current)
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  statements.push(current)
  return statements
    .map((text) => text.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((text) => ({ type: typeOf(text), text }))
}

// A rule matches when some statement has its `statement` type and, if given, matches `content`.
// An `absent` rule matches the other way round: when no such statement is found.
function ruleMatches(rule, statements) {
  const found = statements.some((s) => s.type === rule.statement && (!rule.content || rule.content.test(s.text)))
  return rule.absent ? !found : found
}

// Returns the ids of the steps whose checks pass for the given statements.
export function detectSqlSteps(steps, statements) {
  return steps
    .filter((step) => step.check && [step.check].flat().every((rule) => ruleMatches(rule, statements)))
    .map((step) => step.id)
}
