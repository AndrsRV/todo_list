# Todo List

A projects-based todo list app built with vanilla JavaScript and Webpack. Create projects, add todos with due dates/priority/notes/checklists, and everything persists to `localStorage`.

## Features

- A "Default" project is seeded automatically on first load.
- Create additional projects and assign todos to them (or move a todo between projects from its detail view).
- Add todos with a title, description, due date, priority (low/medium/high, color-coded), notes, and a checklist.
- Expand any todo to view/edit its full details.
- Mark todos complete, delete todos, delete projects (the Default project can't be deleted; its todos are preserved if another project is removed).
- All data persists in `localStorage` and survives a page refresh. The app degrades gracefully if storage is empty, corrupted, or unavailable.

## Architecture

- `src/models/` — factory functions (`createTodo`, `createProject`) that produce plain data objects.
- `src/store.js` — single in-memory source of truth for projects/todos.
- `src/storage/` — `localStorage` persistence, defensively guarded against missing/corrupt data.
- `src/logic/` — application logic (add/update/delete todos & projects, toggle complete, checklist operations). No DOM code lives here.
- `src/dom/` — all rendering and event wiring. Never mutates the store directly; always goes through `logic/`.
- `src/utils/dateUtils.js` — `date-fns`-backed helpers for formatting/comparing due dates.

## Getting Started

```bash
npm install
npm start    # dev server at http://localhost:8080
npm run build  # production bundle in dist/
```
