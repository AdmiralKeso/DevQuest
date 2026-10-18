import { Link } from 'react-router'
import { OBJECTIVES, SKILLS, STACKS } from '../../data/objectives.js'
import InfoPage from '../InfoPage.jsx'

export default function AboutPage() {
  return (
    <InfoPage title="About" className="about-page">
      <section>
        <h2>What is DevQuest?</h2>
        <p>
          DevQuest turns learning web development into a quest. Instead of starting from a blank
          page, you pick a goal (a portfolio, an online store, a blog, a landing page or a business
          website) and build it step by step in a real stack.
        </p>
      </section>

      <section>
        <h2>The quests</h2>
        <p>
          There are {OBJECTIVES.length} quests across {STACKS.length} tech stacks:{' '}
          {STACKS.map((s) => s.label).join(', ')}. Each one has its own objectives and tips for that
          stack. <Link to="/projects">Browse the quests</Link>.
        </p>
      </section>

      <section>
        <h2>Skills</h2>
        <p>Every objective trains one skill:</p>
        <ul>
          {SKILLS.map((skill) => (
            <li key={skill.id}>{skill.label}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>How tracking works</h2>
        <p>
          You link a public GitHub repository to a quest. DevQuest reads its files through the GitHub
          API and ticks off objectives when it finds the code for them. Nothing is uploaded anywhere:
          your links and progress are saved in this browser only.
        </p>
      </section>
    </InfoPage>
  )
}
