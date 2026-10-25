// The single in-memory source of truth for the app's data.
// No DOM code here, and no persistence logic beyond delegating to storage.js.

import { createProject } from './models/Project.js';
import { loadProjects, saveProjects } from './storage/storage.js';

let projects = [];
let activeProjectId = null;

export function init() {
  const loaded = loadProjects();

  if (loaded) {
    projects = loaded;
  } else {
    const defaultProject = createProject({ name: 'Default', isDefault: true });
    projects = [defaultProject];
    saveProjects(projects);
  }

  activeProjectId = projects[0].id;
}

export function getProjects() {
  return projects;
}

export function getProjectById(projectId) {
  return projects.find((project) => project.id === projectId) || null;
}

export function getDefaultProject() {
  return projects.find((project) => project.isDefault) || projects[0];
}

export function getActiveProjectId() {
  return activeProjectId;
}

export function getActiveProject() {
  return getProjectById(activeProjectId) || getDefaultProject();
}

export function setActiveProjectId(projectId) {
  activeProjectId = projectId;
}

export function persist() {
  saveProjects(projects);
}
