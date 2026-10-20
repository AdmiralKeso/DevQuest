import { Link } from 'react-router'
import { COMMON_REQUIREMENTS, GETTING_STARTED_DOC_LINKS, STACKS } from '../../data/objectives.js'
import CodeText from '../CodeText.jsx'
import InfoPage from '../InfoPage.jsx'

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

// Instructions from the main menu: How to play on the left, Requirements and GitHub on the right,
// Docs across the full width under them (all stacked on narrow screens)
export default function InstructionsPage() {
  return (
    <InfoPage title="Instructions" className="instructions-page">
      <div className="instructions-layout">
        <section className="instructions-box instructions-play">
          <h2>How to play</h2>
          <ol className="play-steps">
            <li>
              <h3>Choose a quest</h3>
              <p>
                Open <Link to="/projects">the projects</Link> and pick one. Use the tech stacks on the left
                to see only the quests for one language or framework.
              </p>
            </li>
            <li>
              <h3>Read the quest page</h3>
              <p>
                It lists the requirements, the required structure, the objectives and how to start, with
                tips for every objective you haven't done yet.
              </p>
            </li>
            <li>
              <h3>Create a public GitHub repository</h3>
              <p>Build the project in it, following the required structure.</p>
            </li>
            <li>
              <h3>Link it to the quest</h3>
              <p>Paste the repository URL into "Link to project" on the quest page.</p>
            </li>
            <li>
              <h3>Build and push</h3>
              <p>
                Work through the objectives and push your code, then press "Check now" on the quest page.
                DevQuest ticks an objective off when it finds the code for it.
              </p>
            </li>
            <li>
              <h3>Level up your skills</h3>
              <p>
                Every objective trains a skill: Code Comprehension, Semantic HTML, Defensive Programming or
                Responsive. The rings show how far you are in each, and the big ring shows the whole quest.
              </p>
            </li>
          </ol>
        </section>

        <div className="instructions-side">
          <section className="instructions-box instructions-requirements">
            <h2>Requirements</h2>
            <p>Every quest needs:</p>
            <ul className="requirement-list">
              {COMMON_REQUIREMENTS.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
            <p>Each quest page adds what that quest needs on top, like Node.js or PHP.</p>
            <h3>Required structure</h3>
            <p className="structure-rule">
              Your project has to be exactly like the tree under "Required structure" on the quest page:
              the same folder names, file names and places. DevQuest only reads those files, so a file
              with another name or in another folder is not read and its objectives are not ticked off.
            </p>
          </section>

          <section className="instructions-box instructions-github">
            <h2>GitHub</h2>
            <ul>
              <li>Only public repositories can be linked; DevQuest reads them without logging in.</li>
              <li>
                <CodeText text="Link the repository: `github.com/you/repo`" />
              </li>
              <li>
                <CodeText text="Or a folder in it: `github.com/you/repo/tree/main/my-site`" />
              </li>
              <li>
                Your repository is read when you link it, and again each time you press "Check now".
              </li>
              <li>
                GitHub allows 60 checks an hour without a login, so linking and "Check now" have a short
                cooldown.
              </li>
              <li>Folders like node_modules and vendor are skipped.</li>
              <li>Your ticked objectives are saved in this browser.</li>
            </ul>
          </section>
        </div>

        <section className="instructions-box instructions-docs">
          <h2>Docs</h2>
          <div className="instructions-docs-grid">
            <section className="docs-group">
              <h3>Getting started</h3>
              <DocList links={GETTING_STARTED_DOC_LINKS} />
            </section>
            {STACKS.map((stack) => (
              <section key={stack.id} className={`docs-group docs-${stack.id}`}>
                <h3>{stack.label}</h3>
                <p>{stack.description}</p>
                <DocList links={stack.docLinks} />
              </section>
            ))}
          </div>
        </section>
      </div>
    </InfoPage>
  )
}
