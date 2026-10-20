// Text from objectives.js with the parts between backticks shown as code boxes,
// e.g. 'Run `npm install` first' shows npm install in a .code-box
export default function CodeText({ text }) {
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="code-box">
        {part}
      </code>
    ) : (
      part
    ),
  )
}
