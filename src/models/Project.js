// Factory function for creating Projects (a named collection of todos).
// Plain data object — see Todo.js for the rationale.

export function createProject({ name, isDefault = false } = {}) {
  if (!name || !name.trim()) {
    throw new Error('Project name is required');
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    isDefault,
    todos: [],
  };
}
