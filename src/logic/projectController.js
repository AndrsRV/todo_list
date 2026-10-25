// Project-level application logic. No DOM code allowed in this module.

import { createProject } from '../models/Project.js';
import * as store from '../store.js';

export function addProject(name) {
  const project = createProject({ name });
  store.getProjects().push(project);
  store.persist();
  return project;
}

export function deleteProject(projectId) {
  const projects = store.getProjects();
  const project = store.getProjectById(projectId);

  if (!project || project.isDefault) {
    // The default project can't be deleted — it's always the fallback home for todos.
    return false;
  }

  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return false;

  // Move any todos in the deleted project to the default project instead of losing them.
  const defaultProject = store.getDefaultProject();
  defaultProject.todos.push(...project.todos);

  projects.splice(index, 1);

  if (store.getActiveProjectId() === projectId) {
    store.setActiveProjectId(defaultProject.id);
  }

  store.persist();
  return true;
}

export function setActiveProject(projectId) {
  if (store.getProjectById(projectId)) {
    store.setActiveProjectId(projectId);
    return true;
  }
  return false;
}
