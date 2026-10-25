// Todo-level application logic. No DOM code allowed in this module.

import { createTodo, createChecklistItem } from '../models/Todo.js';
import * as store from '../store.js';

function findTodoAndProject(todoId) {
  for (const project of store.getProjects()) {
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) return { todo, project };
  }
  return { todo: null, project: null };
}

export function addTodo(projectId, fields) {
  const project = store.getProjectById(projectId) || store.getDefaultProject();
  const todo = createTodo(fields);
  project.todos.push(todo);
  store.persist();
  return todo;
}

export function deleteTodo(todoId) {
  const { project } = findTodoAndProject(todoId);
  if (!project) return false;

  project.todos = project.todos.filter((t) => t.id !== todoId);
  store.persist();
  return true;
}

export function updateTodo(todoId, fields) {
  const { todo } = findTodoAndProject(todoId);
  if (!todo) return null;

  Object.assign(todo, fields);
  store.persist();
  return todo;
}

export function toggleComplete(todoId) {
  const { todo } = findTodoAndProject(todoId);
  if (!todo) return null;

  todo.completed = !todo.completed;
  store.persist();
  return todo;
}

export function setPriority(todoId, priority) {
  return updateTodo(todoId, { priority });
}

export function moveTodoToProject(todoId, targetProjectId) {
  const { todo, project } = findTodoAndProject(todoId);
  const targetProject = store.getProjectById(targetProjectId);
  if (!todo || !project || !targetProject || project.id === targetProjectId) return false;

  project.todos = project.todos.filter((t) => t.id !== todoId);
  targetProject.todos.push(todo);
  store.persist();
  return true;
}

export function addChecklistItem(todoId, text) {
  const { todo } = findTodoAndProject(todoId);
  if (!todo || !text.trim()) return null;

  const item = createChecklistItem(text.trim());
  todo.checklist.push(item);
  store.persist();
  return item;
}

export function toggleChecklistItem(todoId, itemId) {
  const { todo } = findTodoAndProject(todoId);
  if (!todo) return false;

  const item = todo.checklist.find((i) => i.id === itemId);
  if (!item) return false;

  item.completed = !item.completed;
  store.persist();
  return true;
}

export function removeChecklistItem(todoId, itemId) {
  const { todo } = findTodoAndProject(todoId);
  if (!todo) return false;

  todo.checklist = todo.checklist.filter((i) => i.id !== itemId);
  store.persist();
  return true;
}
