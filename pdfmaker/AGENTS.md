# PDF maker

Makes PDF files that show the progress made in the DevQuest app, like finished projects and achievements.

What it does
- Writes the PDF by hand (raw PDF syntax) and saves it with `fs.writeFileSync`.
- The PDF can be opened in the browser and downloaded from it.
- Handles errors, like a file that isn't found or a server error.

Steps
1. A boilerplate PDF that takes the finished projects as arguments.

Files
- `pdf.png`: the certificate design (2400 x 3300 px, 8 x 11 inches at 300 dpi): logo, title, the line under it, the GitHub box, the signature and the curves. Every page of the PDF is drawn on it; the empty space is where the text goes.
- `pdfMaker.js`: importable by the pages (no Node-only code). 
- `createProgressPdf(projects, { name, date })` returns the PDF as bytes; a project is `{ title, stack?, difficulty?, completedAt? }`. 
- `downloadPdf(bytes, filename)` downloads it in the browser.
- Used by the Profile page (`src/components/pages/ProfilePage.jsx`): its "Download PDF" button makes a report of the finished projects.
- `pngImage.js`: `readPng(bytes)` turns the PNG into an image a PDF can show (the pixels unpacked and packed again as RGB, transparency mixed with white), with the browser's and Node's built-in `DecompressionStream`/`CompressionStream`. Only 8-bit RGB or RGBA PNGs that aren't interlaced.
- `test.js`: `node pdfmaker/test.js` saves a PDF with sample projects to `pdfmaker/output/` with `fs.writeFileSync` (gitignored); `--api` uses the finished projects from the local API, a JSON file path uses the projects in that file.

Rules
- No libraries: everything is written by hand.
- Keep the code unobtrusive and easy to read, so it's easy to change.

Commit rules
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before committing or wait when told to.
- Push to main directly
