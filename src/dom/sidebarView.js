import { el, clear } from './helpers.js';

// Renders the project list + "add project" form into `container`.
// Purely presentational — all callbacks are supplied by domController.
export function render(container, { projects, activeProjectId, onSelectProject, onDeleteProject, onAddProject }) {
  clear(container);

  const heading = el('h1', { className: 'app-title', text: 'Todo List' });

  const list = el('ul', { className: 'project-list' },
    projects.map((project) => renderProjectRow(project, activeProjectId, onSelectProject, onDeleteProject))
  );

  const form = renderAddProjectForm(onAddProject);

  container.append(heading, list, form);
}

function renderProjectRow(project, activeProjectId, onSelectProject, onDeleteProject) {
  const isActive = project.id === activeProjectId;

  const nameButton = el('button', {
    className: 'project-name',
    text: `${project.name} (${project.todos.filter((t) => !t.completed).length})`,
    type: 'button',
    onClick: () => onSelectProject(project.id),
  });

  const children = [nameButton];

  if (!project.isDefault) {
    const deleteButton = el('button', {
      className: 'project-delete',
      text: '✕',
      type: 'button',
      attrs: { 'aria-label': `Delete project ${project.name}` },
      onClick: (event) => {
        event.stopPropagation();
        onDeleteProject(project.id);
      },
    });
    children.push(deleteButton);
  }

  return el('li', { className: `project-row${isActive ? ' active' : ''}` }, children);
}

function renderAddProjectForm(onAddProject) {
  const input = el('input', {
    className: 'project-input',
    type: 'text',
    placeholder: 'New project name',
  });

  const form = el('form', { className: 'add-project-form' }, [input]);

  const submitButton = el('button', { className: 'add-project-btn', text: '+ Add Project', type: 'submit' });
  form.appendChild(submitButton);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    onAddProject(name);
    input.value = '';
  });

  return form;
}
