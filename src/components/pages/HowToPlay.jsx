import { Link } from 'react-router'
import InfoPage from '../InfoPage.jsx'

export default function HowToPlay() {
  return (
    <InfoPage title="How to play" className="how-to-play">
      <ol className="play-steps">
        <li>
          <h2>Choose a quest</h2>
          <p>
            Open <Link to="/projects">Start a quest</Link> and pick a project. Use the tech stack list on
            the left to see only Laravel, Django, Node or React quests.
          </p>
        </li>
        <li>
          <h2>Check the requirements</h2>
          <p>
            Every quest page lists what you need before you start, like Node.js or PHP, and links to the
            docs you'll use along the way.
          </p>
        </li>
        <li>
          <h2>Create a public GitHub repository</h2>
          <p>This is where you build the project. It has to be public so DevQuest can read it.</p>
        </li>
        <li>
          <h2>Link it to the quest</h2>
          <p>
            Paste the repository URL into "Link to project". If your project lives in a subfolder, link
            that folder, like github.com/you/repo/tree/main/my-site.
          </p>
        </li>
        <li>
          <h2>Build and push</h2>
          <p>
            Work through the objectives and push your code. Press "Check now" to let DevQuest
            read your repository; it ticks off objectives when it finds the code for them.
          </p>
        </li>
        <li>
          <h2>Level up your skills</h2>
          <p>
            Every objective trains a skill: Code Comprehension, Semantic HTML, Defensive Programming or
            Responsive. The rings show how far you are in each, and the big ring shows the whole quest.
          </p>
        </li>
      </ol>

      <section className="play-rules">
        <h2>Good to know</h2>
        <ul>
          <li>Only public GitHub repositories can be linked.</li>
          <li>
            GitHub allows 60 checks an hour without a login, so linking and "Check now" have a short
            cooldown.
          </li>
          <li>Your progress is saved in this browser. Unlinking a repository resets its tracked objectives.</li>
          <li>Static Analysis with a Js Linter is coming in a later update.</li>
        </ul>
      </section>
    </InfoPage>
  )
}
