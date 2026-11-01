// PDF maker: writes a DevQuest progress report as a raw PDF, by hand, without libraries.
// Works in the browser and in Node (no Node-only imports), so the pages can import it:
//   import { createProgressPdf, downloadPdf } from '../../../pdfmaker/pdfMaker.js'
//   downloadPdf(createProgressPdf(projects))
// A project is { title, stack?, difficulty?, completedAt? } (completedAt: a date, date string or timestamp).

// A4 in PDF points (1/72 inch), and the space kept free around the text
const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 56

// Text styles: the font (F1 Helvetica, F2 Helvetica-Bold, both built into every PDF reader), size and line height
const STYLES = {
  title: { font: 'F2', size: 24, height: 32 },
  subtitle: { font: 'F1', size: 13, height: 20 },
  heading: { font: 'F2', size: 14, height: 26 },
  project: { font: 'F2', size: 12, height: 17 },
  detail: { font: 'F1', size: 10, height: 20 },
  small: { font: 'F1', size: 9, height: 12 },
}

// Returns the PDF as bytes (a Uint8Array) for the finished `projects`.
// Options: `name` (shown under the title) and `date` (the report's date, today by default).
export function createProgressPdf(projects, { name = '', date = new Date() } = {}) {
  if (!Array.isArray(projects)) {
    throw new TypeError('createProgressPdf: projects must be an array')
  }
  for (const project of projects) {
    if (!project || typeof project.title !== 'string' || project.title.trim() === '') {
      throw new TypeError('createProgressPdf: every project needs a title')
    }
  }

  const lines = reportLines(projects, { name, date })
  const pages = splitIntoPages(lines)
  return toBytes(buildPdf(pages))
}

// Saves PDF bytes as a file from the browser (the "download" of a link).
export function downloadPdf(bytes, filename = 'devquest-certificate.pdf') {
  if (typeof document === 'undefined') {
    throw new Error('downloadPdf only works in the browser; in Node, save the bytes with fs.writeFileSync')
  }
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before the file is freed
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// The report as a list of lines, top to bottom: [{ text, style }]
function reportLines(projects, { name, date }) {
  const lines = [
    { text: 'DevQuest', style: 'title' },
    { text: name ? `Progress report for ${name}` : 'Progress report', style: 'subtitle' },
    { text: `Made on ${formatDate(date)}`, style: 'small' },
    { text: '', style: 'detail' },
    { text: `Finished projects: ${projects.length}`, style: 'heading' },
  ]

  if (projects.length === 0) {
    lines.push({ text: 'No finished projects yet.', style: 'detail' })
  }
  for (const project of projects) {
    const details = [project.stack, project.difficulty, project.completedAt && `finished on ${formatDate(project.completedAt)}`]
    lines.push({ text: project.title, style: 'project' })
    lines.push({ text: details.filter(Boolean).join(' · '), style: 'detail' })
  }
  return lines
}

// Fills pages from the top until the next line doesn't fit above the bottom margin
function splitIntoPages(lines) {
  const pages = [[]]
  let y = PAGE_HEIGHT - MARGIN
  for (const line of lines) {
    const { height } = STYLES[line.style]
    if (y - height < MARGIN) {
      pages.push([])
      y = PAGE_HEIGHT - MARGIN
    }
    y -= height
    pages.at(-1).push({ ...line, y })
  }
  return pages
}

// The drawing commands for one page: each line as text at its place, and the page number at the bottom
function pageContent(lines, pageNumber, pageCount) {
  const commands = lines
    .filter((line) => line.text)
    .map((line) => text(line.text, STYLES[line.style], MARGIN, line.y))
  commands.push(text(`Page ${pageNumber} of ${pageCount}`, STYLES.small, MARGIN, MARGIN / 2))
  return commands.join('\n')
}

// BT ... ET is a text block: font and size (Tf), position from the bottom-left (Td), then the text (Tj)
function text(value, style, x, y) {
  return `BT /${style.font} ${style.size} Tf ${x} ${y} Td (${escapeText(value)}) Tj ET`
}

// Puts the PDF together: numbered objects, then the cross-reference table that says where each one starts
function buildPdf(pages) {
  const objects = []
  const add = (body) => objects.push(body) // object number = its place in the list, counting from 1

  add('<< /Type /Catalog /Pages 2 0 R >>')
  add('') // 2: the page list, filled in once the page objects have numbers
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')

  const pageNumbers = []
  pages.forEach((lines, i) => {
    const content = pageContent(lines, i + 1, pages.length)
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const contentNumber = objects.length
    add(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`,
    )
    pageNumbers.push(objects.length)
  })
  objects[1] = `<< /Type /Pages /Kids [${pageNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pages.length} >>`

  // Every character is one byte (see toBytes), so string lengths are byte offsets
  let pdf = '%PDF-1.4\n'
  const offsets = objects.map((body, i) => {
    const offset = pdf.length
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
    return offset
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return pdf
}

// Text in a PDF string: \ ( and ) need a backslash. Characters the built-in fonts don't have become ?
function escapeText(value) {
  return String(value)
    .replace(/[^\x20-\x7e\xa0-\xff]/g, '?')
    .replace(/[\\()]/g, '\\$&')
}

// One byte per character (Latin-1, which the WinAnsi fonts read the same way for these characters)
function toBytes(pdf) {
  return Uint8Array.from(pdf, (char) => char.charCodeAt(0))
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
