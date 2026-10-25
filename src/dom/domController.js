// Top-level orchestrator: the only module that imports both the app logic
// and the view-rendering modules. Owns the "which todo is open in the detail
// view" UI state (not app data, so it isn't persisted) and re-renders after
// every mutating action.

import * as store from '../store.js';
import * as todoController from '../logic/todoController.js';
import * as projectController from '../logic/projectController.js';
import * as sidebarView from './sidebarView.js';
import * as todoListView from './todoListView.js';
import * as todoDetailView from './todoDetailView.js';

let sidebarEl;
let mainEl;
let detailEl;
let openTodoId = null;

export function init(rootEl) {
  sidebarEl = document.createElement('aside');
  sidebarEl.className = 'sidebar';

  mainEl = document.createElement('main');
  mainEl.className = 'main-panel';

  detailEl = document.createElement('div');
  detailEl.className = 'detail-overlay';
  detailEl.hidden = true;

  rootEl.append(sidebarEl, mainEl, detailEl);

  renderAll();
}

function renderAll() {
  renderSidebar();
  renderMain();
  renderDetail();
}

function renderSidebar() {
  sidebarView.render(sidebarEl, {
    projects: store.getProjects(),
    activeProjectId: store.getActiveProjectId(),
    onSelectProject: (projectId) => {
      projectController.setActiveProject(projectId);
      renderAll();
    },
    onDeleteProject: (projectId) => {
      projectController.deleteProject(projectId);
      renderAll();
    },
    onAddProject: (name) => {
      projectController.addProject(name);
      renderAll();
    },
  });
}

function renderMain() {
  const project = store.getActiveProject();

  todoListView.render(mainEl, {
    project,
    onAddTodo: (fields) => {
      todoController.addTodo(project.id, fields);
      renderAll();
    },
    onToggleComplete: (todoId) => {
      todoController.toggleComplete(todoId);
      renderAll();
    },
    onDeleteTodo: (todoId) => {
      todoController.deleteTodo(todoId);
      if (openTodoId === todoId) openTodoId = null;
      renderAll();
    },
    onOpenDetail: (todoId) => {
      openTodoId = todoId;
      renderAll();
    },
  });
}

function renderDetail() {
  const todo = findTodoById(openTodoId);

  // Checklist actions (add/toggle/remove) persist immediately and re-render
  // the whole modal. Without this, any not-yet-saved edits the user typed
  // into the other fields (title, description, due date, ...) would be
  // wiped out by that re-render. Carry them forward as display-only values.
  const draft = captureDraftFields(todo);
  const displayTodo = draft ? { ...todo, ...draft.todoFields } : todo;
  const displayProjectId = draft ? draft.targetProjectId : store.getActiveProjectId();

  todoDetailView.render(detailEl, {
    todo: displayTodo,
    projects: store.getProjects(),
    activeProjectId: displayProjectId,
    onSave: (todoId, { targetProjectId, ...fields }) => {
      todoController.updateTodo(todoId, fields);
      if (targetProjectId && targetProjectId !== store.getActiveProjectId()) {
        todoController.moveTodoToProject(todoId, targetProjectId);
      }
      openTodoId = null;
      renderAll();
    },
    onDelete: (todoId) => {
      todoController.deleteTodo(todoId);
      openTodoId = null;
      renderAll();
    },
    onClose: () => {
      openTodoId = null;
      renderAll();
    },
    onAddChecklistItem: (todoId, text) => {
      todoController.addChecklistItem(todoId, text);
      renderAll();
    },
    onToggleChecklistItem: (todoId, itemId) => {
      todoController.toggleChecklistItem(todoId, itemId);
      renderAll();
    },
    onRemoveChecklistItem: (todoId, itemId) => {
      todoController.removeChecklistItem(todoId, itemId);
      renderAll();
    },
  });
}

function captureDraftFields(todo) {
  if (!todo) return null;

  const form = detailEl.querySelector('.todo-detail-form');
  if (!form) return null;

  const title = form.querySelector('.detail-title')?.value.trim();

  return {
    todoFields: {
      title: title || todo.title,
      description: form.querySelector('.detail-description')?.value ?? todo.description,
      notes: form.querySelector('.detail-notes')?.value ?? todo.notes,
      dueDate: form.querySelector('.detail-due-date')?.value || null,
      priority: form.querySelector('.detail-priority')?.value ?? todo.priority,
    },
    targetProjectId: form.querySelector('.detail-project')?.value ?? store.getActiveProjectId(),
  };
}

function findTodoById(todoId) {
  if (!todoId) return null;
  for (const project of store.getProjects()) {
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) return todo;
  }
  return null;
}
