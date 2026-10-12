import { STACKS } from '../data/objectives.js'

// `data-stack` lets you style each stack separately, e.g. .stack-badge[data-stack="laravel"]
export default function StackBadge({ stackId }) {
  const stack = STACKS.find((s) => s.id === stackId)

  return (
    <span className="stack-badge" data-stack={stack.id}>
      {stack.label}
    </span>
  )
}
