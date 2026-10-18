import { GETTING_STARTED_DOC_LINKS, STACKS } from '../data/objectives.js'
import InfoPage from './InfoPage.jsx'

function DocList({ links }) {
  return (
    <ul className="doc-list">
      {links.map((docLink) => (
        <li key={docLink.url}>
          <a href={docLink.url} target="_blank" rel="noreferrer">
            {docLink.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

// Docs page from the main menu: getting started links, then the docs for each tech stack.
export default function DocsPage() {
  return (
    <InfoPage title="Docs" className="docs-page">
      <section className="docs-group">
        <h2>Getting started</h2>
        <DocList links={GETTING_STARTED_DOC_LINKS} />
      </section>
      {STACKS.map((stack) => (
        <section key={stack.id} className={`docs-group docs-${stack.id}`}>
          <h2>{stack.label}</h2>
          <p>{stack.description}</p>
          <DocList links={stack.docLinks} />
        </section>
      ))}
    </InfoPage>
  )
}
