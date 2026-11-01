# PDF maker

Makes PDF files that show the progress made in the DevQuest app, like finished projects and achievements.

What it does
- Writes the PDF by hand (raw PDF syntax) and saves it with `fs.writeFileSync`.
- The PDF can be opened in the browser and downloaded from it.
- Handles errors, like a file that isn't found or a server error.

Steps
1. A boilerplate PDF that takes the finished projects as arguments.

Files
- `pdfMaker.js`: importable by the pages (no Node-only code). 
- `createProgressPdf(projects, { name, date })` returns the PDF as bytes; a project is `{ title, stack?, difficulty?, completedAt? }`. 
- `downloadPdf(bytes, filename)` downloads it in the browser.

Rules
- No libraries: everything is written by hand.
- Keep the code unobtrusive and easy to read, so it's easy to change.

Commit rules
- Commit per feature, break it down in steps
- Accurate and small commit that only explains a certain feature
- Use add, update, fix, remove
- Always ask before committing or wait when told to.
- Push to main directly
