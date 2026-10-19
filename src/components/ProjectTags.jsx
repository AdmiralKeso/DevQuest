// A project's optional `tags` (e.g. API) as small labels; nothing when it has none.
// `data-tag` lets you style each tag separately, e.g. .project-tag[data-tag="API"]
export default function ProjectTags({ tags = [] }) {
  return tags.map((tag) => (
    <span key={tag} className="project-tag" data-tag={tag}>
      {tag}
    </span>
  ))
}
