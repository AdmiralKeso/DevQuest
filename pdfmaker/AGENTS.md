# PDF maker

Makes PDF files that show the progress made in the DevQuest app, like finished projects and achievements.

What it does
- Writes the PDF by hand (raw PDF syntax) and saves it with `fs.writeFileSync`.
- The PDF can be opened in the browser and downloaded from it.
- Handles errors, like a file that isn't found or a server error.

Steps
1. A boilerplate PDF that takes the finished projects as arguments.
2. A certificate of completed projects on the `pdf.png` design.

Files
- `pdf.png`: the certificate design (2400 x 3300 px, 8 x 11 inches at 300 dpi): logo, title, the line under it, the GitHub box, the signature and the curves. Every page of the PDF is drawn on it; the empty space is where the text goes.
- `pdfMaker.js`: importable by the pages (no Node-only code). 
- `createProgressPdf(projects, { background, name, total, date })` returns a promise of the PDF as bytes; `background` is `pdf.png` as bytes (or `prepareBackground`'s result), a project is `{ title, stack?, difficulty?, completedAt? }`. The name is centred on the line under the title (Helvetica-Bold widths in `BOLD_WIDTHS`). Under the line: "Issued on <date>", then, when there are projects, "Completed projects" and each project (title, then stack · difficulty · finished on date), left of the yellow curve; "Total projects completed: <total>" (the number of `projects` by default) just above the GitHub box. A long list continues on more pages with the same background and "Page 1 of 2"; the total is on the last page.
- `layoutCertificate(projects, { name, total, date })` returns where every text goes, page by page (`[[{ text, bold, size, x, y }]]`, points from the bottom-left, y is the baseline); the PDF draws these, and the certificate builder's preview places the same texts over `pdf.png`. `PAGE_WIDTH` and `PAGE_HEIGHT` (576 x 792) are exported for that.
- `prepareBackground(png)` reads the design once (the slow part, about 0.4s); passing its result as `background` makes each PDF in about 30ms, for a live preview. The positions are the constants at the top (`TEXT_LEFT`, `CONTENT_TOP`, ...), in points from the bottom-left corner.
- `downloadPdf(bytes, filename)` downloads it in the browser (`devquest-certificate.pdf`).
- `pngImage.js`: `readPng(bytes)` turns the PNG into an image a PDF can show (the pixels unpacked and packed again as RGB, transparency mixed with white), with the browser's and Node's built-in `DecompressionStream`/`CompressionStream`. Only 8-bit RGB or RGBA PNGs that aren't interlaced.
- Used by the Profile page (`src/components/pages/ProfilePage.jsx`): its "Download PDF" button loads `pdf.png` (imported through Vite) and makes the certificate of the finished projects.
- `test.js`: `node pdfmaker/test.js` saves a certificate with sample projects to `pdfmaker/output/devquest-certificate.pdf` with `fs.writeFileSync` (gitignored); `--api` uses the finished projects from the local API, a JSON file path uses the projects in that file.

Rules
- No libraries: everything is written by hand.
- Keep the code unobtrusive and easy to read, so it's easy to change.

Commit rules
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before committing or wait when told to.
- Push to main directly
