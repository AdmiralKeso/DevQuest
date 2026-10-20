// A step's `check` is a rule, or a list of rules that must all match.
// A rule matches when some file's path matches `file` and, if given, its contents match `content`.
// An `absent` rule matches the other way round: when no such file is found.
function ruleMatches(rule, files) {
  const found = files.some(
    (f) => rule.file.test(f.path) && (!rule.content || (f.text !== null && rule.content.test(f.text))),
  )
  return rule.absent ? !found : found
}

// Returns the ids of the steps whose checks pass for the given files.
export function detectSteps(steps, files) {
  return steps
    .filter((step) => step.check && [step.check].flat().every((rule) => ruleMatches(rule, files)))
    .map((step) => step.id)
}

export function isAutoTracked(step) {
  return Boolean(step.check)
}
