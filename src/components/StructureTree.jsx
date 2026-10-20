// A project's `structure` from objectives.js as a folder tree: every two spaces of indent is one level deeper,
// and names ending in / are folders (.structure-folder) whose contents are listed under them
function buildTree(lines) {
  const root = { children: [] }
  const parents = [root]
  for (const line of lines) {
    const depth = Math.floor((line.length - line.trimStart().length) / 2)
    const node = { name: line.trim(), children: [] }
    parents[Math.min(depth, parents.length - 1)].children.push(node)
    parents[depth + 1] = node
    parents.length = depth + 2
  }
  return root.children
}

function TreeList({ nodes }) {
  return (
    <ul className="structure-list">
      {nodes.map((node) => {
        const folder = node.name.endsWith('/')
        return (
          <li key={node.name} className={folder ? 'structure-folder' : 'structure-file'}>
            <span className="structure-name">{node.name}</span>
            {node.children.length > 0 && <TreeList nodes={node.children} />}
          </li>
        )
      })}
    </ul>
  )
}

export default function StructureTree({ lines }) {
  return (
    <div className="structure-tree">
      <TreeList nodes={buildTree(lines)} />
    </div>
  )
}
