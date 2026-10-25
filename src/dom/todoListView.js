import { el, clear } from './helpers.js';
import { formatDueDate, isOverdue } from '../utils/dateUtils.js';

// Renders the active project's header, "add todo" form, and todo rows.
export function render(container, { project, onAddTodo, onToggleComplete, onDeleteTodo, onOpenDetail }) {
  clear(container);

  const header = el('div', { className: 'project-header' }, [
    el('h2', { className: 'project-title', text: project.name }),
  ]);

  const addForm = renderAddTodoForm(onAddTodo);

  const incomplete = project.todos.filter((t) => !t.completed);
  const completed = project.todos.filter((t) => t.completed);

  const list = el('ul', { className: 'todo-list' }, [
    ...incomplete.map((todo) => renderTodoRow(todo, onToggleComplete, onDeleteTodo, onOpenDetail)),
    ...completed.map((todo) => renderTodoRow(todo, onToggleComplete, onDeleteTodo, onOpenDetail)),
  ]);

  if (project.todos.length === 0) {
    list.appendChild(el('li', { className: 'empty-state', text: 'No todos yet. Add one above!' }));
  }

  container.append(header, addForm, list);
}

function renderAddTodoForm(onAddTodo) {
  const titleInput = el('input', {
    className: 'todo-title-input',
    type: 'text',
    placeholder: 'What needs doing?',
    attrs: { required: 'true' },
  });

  const dueDateInput = el('input', { className: 'todo-due-input', type: 'date' });

  const priorityInput = el('select', { className: 'todo-priority-input' }, [
    el('option', { text: 'Low', attrs: { value: 'low' } }),
    el('option', { text: 'Medium', attrs: { value: 'medium', selected: 'selected' } }),
    el('option', { text: 'High', attrs: { value: 'high' } }),
  ]);
  priorityInput.value = 'medium';

  const submitButton = el('button', { className: 'add-todo-btn', text: 'Add Todo', type: 'submit' });

  const form = el('form', { className: 'add-todo-form' }, [
    titleInput,
    dueDateInput,
    priorityInput,
    submitButton,
  ]);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) return;

    onAddTodo({
      title,
      dueDate: dueDateInput.value || null,
      priority: priorityInput.value,
    });

    titleInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'medium';
    titleInput.focus();
  });

  return form;
}

function renderTodoRow(todo, onToggleComplete, onDeleteTodo, onOpenDetail) {
  const checkbox = el('input', {
    type: 'checkbox',
    className: 'todo-checkbox',
    checked: todo.completed,
    onClick: (event) => {
      event.stopPropagation();
      onToggleComplete(todo.id);
    },
  });

  const title = el('span', {
    className: `todo-title${todo.completed ? ' completed' : ''}`,
    text: todo.title,
  });

  const dueDateLabel = formatDueDate(todo.dueDate);
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const dueDate = el('span', {
    className: `todo-due-date${overdue ? ' overdue' : ''}`,
    text: dueDateLabel,
  });

  const deleteButton = el('button', {
    className: 'todo-delete-btn',
    text: '🗑',
    type: 'button',
    attrs: { 'aria-label': `Delete ${todo.title}` },
    onClick: (event) => {
      event.stopPropagation();
      onDeleteTodo(todo.id);
    },
  });

  const row = el(
    'li',
    {
      className: `todo-row priority-${todo.priority}${todo.completed ? ' completed' : ''}`,
      onClick: () => onOpenDetail(todo.id),
    },
    [checkbox, title, dueDate, deleteButton]
  );

  return row;
}
