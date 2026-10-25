// Factory function for creating Todo items.
// Returns a plain data object (no bound methods) so it round-trips
// cleanly through JSON.stringify/parse for localStorage persistence.
// All mutation logic lives in logic/todoController.js instead.

export const PRIORITIES = ['low', 'medium', 'high'];

export function createTodo({
  title,
  description = '',
  dueDate = null, // ISO date string, e.g. '2026-11-02'
  priority = 'medium',
  notes = '',
  checklist = [],
} = {}) {
  if (!title || !title.trim()) {
    throw new Error('Todo title is required');
  }

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    description,
    dueDate,
    priority: PRIORITIES.includes(priority) ? priority : 'medium',
    notes,
    checklist: checklist.map((item) => createChecklistItem(item.text, item.completed)),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function createChecklistItem(text, completed = false) {
  return {
    id: crypto.randomUUID(),
    text,
    completed,
  };
}
