// Thin, defensive wrapper around the Web Storage API.
// Never throws: callers always get a usable value back (or null on load).

const STORAGE_KEY = 'todo-app-projects';

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    // Storage may be unavailable (private browsing, quota exceeded, etc.)
    console.warn('Could not save todos to localStorage:', error);
  }
}

export function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed;
  } catch (error) {
    console.warn('Could not load todos from localStorage:', error);
    return null;
  }
}
