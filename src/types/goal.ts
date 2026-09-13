export interface Goal {
  id: string
  title: string
  parentId: string | null
  order: number
  completed: boolean
  createdAt: number
}

export interface GoalNode extends Goal {
  children: GoalNode[]
}

export function buildGoalTree(goals: Goal[]): GoalNode[] {
  const nodes = new Map<string, GoalNode>(goals.map((g) => [g.id, { ...g, children: [] }]))
  const roots: GoalNode[] = []

  for (const goal of goals) {
    const node = nodes.get(goal.id)!
    if (goal.parentId && nodes.has(goal.parentId)) {
      nodes.get(goal.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

/** Progreso 0-1 según hijos completados; una meta sin hijos usa su propio estado. */
export function goalProgress(node: GoalNode): number {
  if (node.children.length === 0) return node.completed ? 1 : 0
  const sum = node.children.reduce((acc, child) => acc + goalProgress(child), 0)
  return sum / node.children.length
}
