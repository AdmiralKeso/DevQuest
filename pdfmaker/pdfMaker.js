// PDF maker: writes a DevQuest certificate of completed projects as a raw PDF, by hand, without libraries.
// Every page has the certificate design (pdfmaker/pdf.png) as its background, with the projects written on top.
// Works in the browser and in Node (no Node-only imports), so the pages can import it:
//   import { createProgressPdf, downloadPdf } from '../../../pdfmaker/pdfMaker.js'
//   downloadPdf(await createProgressPdf(projects, { background: pngBytes, name: 'Cas', total: 7 }))
// A project is { title, stack?, difficulty?, completedAt? } (completedAt: a date, date string or timestamp).
// To make many PDFs quickly (a live preview), read the design once with prepareBackground and pass that instead.
import { readPng } from './pngImage.js'

// 8 x 11 inches in PDF points (1/72 inch): the shape of pdf.png (2400 x 3300 pixels at 300 dpi)
export const PAGE_WIDTH = 576
export const PAGE_HEIGHT = 792

// Where the text goes on the design, in points from the bottom-left corner: the name centred on the line under
// the title, the projects in the empty space under it (left of the yellow curve), and the total just above the
// GitHub box
const TEXT_LEFT = 86
const NAME_CENTER = 288
const NAME_Y = 594
const CONTENT_TOP = 560
const CONTENT_BOTTOM = 160
const TOTAL_Y = 122
const PAGE_NUMBER_X = 330

// Text styles: the font (F1 Helvetica, F2 Helvetica-Bold, both built into every PDF reader), size, and the space
// above the line (so a project's title has room above it and its details sit close under it)
const STYLES = {
  name: { font: 'F2', size: 22, height: 24 },
  total: { font: 'F2', size: 14, height: 18 },
  small: { font: 'F1', size: 10, height: 22 },
  heading: { font: 'F2', size: 16, height: 32 },
  project: { font: 'F2', size: 13, height: 30 },
  detail: { font: 'F1', size: 10, height: 15 },
}

// Returns (a promise of) the PDF as bytes, a Uint8Array, with the `projects` listed.
// Options: `background` (the PNG design as bytes, or prepareBackground's result; without it the pages are white),
// `name` (centred on the line), `total` (the number of projects completed, at the bottom; the number of `projects`
// by default) and `date` (the date it was issued, today by default).
export async function createProgressPdf(projects, { background, ...options } = {}) {
  const pages = layoutCertificate(projects, options)
  const image = background ? await prepareBackground(background) : null
  return toBytes(buildPdf(pages, image))
}

// Where every text goes, page by page: [[{ text, bold, size, x, y }]], with x and y in points from the bottom-left
// corner (y is the baseline). The PDF draws these; a preview on a page can place the same texts over pdf.png.
// Takes the same `name`, `total` and `date` options as createProgressPdf.
export function layoutCertificate(projects, { name = '', total = projects?.length, date = new Date() } = {}) {
  if (!Array.isArray(projects)) {
    throw new TypeError('createProgressPdf: projects must be an array')
  }
  for (const project of projects) {
    if (!project || typeof project.title !== 'string' || project.title.trim() === '') {
      throw new TypeError('createProgressPdf: every project needs a title')
    }
  }

  const pages = splitIntoPages(certificateLines(projects, date))
  const trimmedName = name.trim()
  return pages.map((lines, i) => {
    const pageNumber = i + 1
    const texts = []
    if (trimmedName) texts.push(place(trimmedName, 'name', NAME_CENTER - textWidth(trimmedName, STYLES.name) / 2, NAME_Y))
    for (const line of lines) texts.push(place(line.text, line.style, TEXT_LEFT, line.y))
    if (pageNumber === pages.length) texts.push(place(`Total projects completed: ${total}`, 'total', TEXT_LEFT, TOTAL_Y))
    if (pages.length > 1) texts.push(place(`Page ${pageNumber} of ${pages.length}`, 'small', PAGE_NUMBER_X, TOTAL_Y))
    return texts
  })
}

// One placed text, with its style's font (bold or not) and size
function place(text, styleName, x, y) {
  const style = STYLES[styleName]
  return { text, bold: style.font === 'F2', size: style.size, x, y }
}

// Reads the PNG design into the image the PDF draws (the slow part). Passing the result to createProgressPdf
// skips that, so a preview can be rebuilt on every change. Something already prepared is returned as it is.
export async function prepareBackground(background) {
  return background.data && background.width ? background : readPng(background)
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

// The text under the line, top to bottom: [{ text, style }]
function certificateLines(projects, date) {
  const lines = [
    { text: `Issued on ${formatDate(date)}`, style: 'small' },
  ]

  if (projects.length > 0) lines.push({ text: 'Completed projects', style: 'heading' })
  for (const project of projects) {
    const details = [project.stack, project.difficulty, project.completedAt && `finished on ${formatDate(project.completedAt)}`]
    lines.push({ text: project.title, style: 'project' })
    lines.push({ text: details.filter(Boolean).join(' · '), style: 'detail' })
  }
  return lines
}

// Fills the space under the line on each page; a line that doesn't fit above the GitHub box starts a new page
function splitIntoPages(lines) {
  const pages = [[]]
  let y = CONTENT_TOP
  for (const line of lines) {
    const { height } = STYLES[line.style]
    if (y - height < CONTENT_BOTTOM) {
      pages.push([])
      y = CONTENT_TOP
    }
    y -= height
    pages.at(-1).push({ ...line, y })
  }
  return pages
}

// The drawing commands for one page: the background over the whole page, then each placed text
function pageContent(texts, image) {
  const commands = []
  // q ... Q keeps the scaling to this image only; cm scales the 1x1 image to the page, Do draws it
  if (image) commands.push(`q ${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm /Bg Do Q`)
  for (const placed of texts) {
    if (placed.text) commands.push(drawText(placed))
  }
  return commands.join('\n')
}

// BT ... ET is a text block: font and size (Tf), position from the bottom-left (Td), then the text (Tj)
function drawText({ text, bold, size, x, y }) {
  return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${round(x)} ${round(y)} Td (${escapeText(text)}) Tj ET`
}

function round(value) {
  return Math.round(value * 100) / 100
}

// Puts the PDF together: numbered objects, then the cross-reference table that says where each one starts
function buildPdf(pages, image) {
  const objects = []
  const add = (body) => objects.push(body) // object number = its place in the list, counting from 1

  add('<< /Type /Catalog /Pages 2 0 R >>')
  add('') // 2: the page list, filled in once the page objects have numbers
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')

  // The background is stored once and drawn on every page
  let imageResource = ''
  if (image) {
    add(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB ` +
        `/BitsPerComponent 8 /Filter /FlateDecode /Length ${image.data.length} >>\nstream\n${toBinaryString(image.data)}\nendstream`,
    )
    imageResource = ` /XObject << /Bg ${objects.length} 0 R >>`
  }

  const pageNumbers = []
  pages.forEach((texts) => {
    const content = pageContent(texts, image)
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const contentNumber = objects.length
    add(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >>${imageResource} >> /Contents ${contentNumber} 0 R >>`,
    )
    pageNumbers.push(objects.length)
  })
  objects[1] = `<< /Type /Pages /Kids [${pageNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pages.length} >>`

  // Every character is one byte (see toBytes), so string lengths are byte offsets.
  // The second line (bytes above 127) tells readers the file holds binary data, the image.
  let pdf = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'
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

// Helvetica-Bold character widths (per 1000 points of font size) for the characters space to ~, from the font's
// metrics, to centre the name. Other characters count as 556, about the width of a lowercase letter.
const BOLD_WIDTHS = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611,
  556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389,
  280, 389, 584,
]

// How wide a text is in points, for a style in Helvetica-Bold
function textWidth(value, style) {
  let units = 0
  for (const char of String(value)) units += BOLD_WIDTHS[char.charCodeAt(0) - 32] ?? 556
  return (units * style.size) / 1000
}

// Text in a PDF string: \ ( and ) need a backslash. Characters the built-in fonts don't have become ?
function escapeText(value) {
  return String(value)
    .replace(/[^\x20-\x7e\xa0-\xff]/g, '?')
    .replace(/[\\()]/g, '\\$&')
}

// Bytes as a string with one character per byte, in pieces (one call per byte would be slow for an image)
function toBinaryString(bytes) {
  let result = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    result += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return result
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
