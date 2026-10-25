import { el, clear } from './helpers.js';
import { toDateInputValue } from '../utils/dateUtils.js';

// Renders a modal overlay for viewing/editing a single todo's full details.
// `container` is a persistent overlay element kept in the DOM and toggled via [hidden].
export function render(
  container,
  { todo, projects, activeProjectId, onSave, onDelete, onClose, onAddChecklistItem, onToggleChecklistItem, onRemoveChecklistItem }
) {
  clear(container);

  if (!todo) {
    container.hidden = true;
    return;
  }

  container.hidden = false;

  const titleInput = el('input', { className: 'detail-title', type: 'text', value: todo.title, attrs: { required: 'true' } });
  const descriptionInput = el('textarea', { className: 'detail-description', value: todo.description, attrs: { placeholder: 'Description', rows: '3' } });
  const notesInput = el('textarea', { className: 'detail-notes', value: todo.notes, attrs: { placeholder: 'Notes', rows: '3' } });
  const dueDateInput = el('input', { className: 'detail-due-date', type: 'date', value: toDateInputValue(todo.dueDate) });

  const priorityInput = el('select', { className: 'detail-priority' }, [
    el('option', { text: 'Low', attrs: { value: 'low' } }),
    el('option', { text: 'Medium', attrs: { value: 'medium' } }),
    el('option', { text: 'High', attrs: { value: 'high' } }),
  ]);
  priorityInput.value = todo.priority;

  const projectSelect = el(
    'select',
    { className: 'detail-project' },
    projects.map((p) => el('option', { text: p.name, attrs: { value: p.id } }))
  );
  projectSelect.value = activeProjectId;

  const checklistSection = renderChecklist(todo, onToggleChecklistItem, onRemoveChecklistItem, onAddChecklistItem);

  const saveButton = el('button', { className: 'detail-save-btn', text: 'Save', type: 'submit' });
  const deleteButton = el('button', {
    className: 'detail-delete-btn',
    text: 'Delete Todo',
    type: 'button',
    onClick: () => onDelete(todo.id),
  });
  const closeButton = el('button', { className: 'detail-close-btn', text: '✕', type: 'button', onClick: onClose });

  const form = el(
    'form',
    { className: 'todo-detail-form' },
    [
      el('div', { className: 'detail-header' }, [el('h3', { text: 'Edit Todo' }), closeButton]),
      labeled('Title', titleInput),
      labeled('Description', descriptionInput),
      labeled('Due date', dueDateInput),
      labeled('Priority', priorityInput),
      labeled('Project', projectSelect),
      labeled('Notes', notesInput),
      checklistSection,
      el('div', { className: 'detail-actions' }, [saveButton, deleteButton]),
    ]
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onSave(todo.id, {
      title: titleInput.value.trim() || todo.title,
      description: descriptionInput.value,
      notes: notesInput.value,
      dueDate: dueDateInput.value || null,
      priority: priorityInput.value,
      targetProjectId: projectSelect.value,
    });
  });

  const backdrop = el('div', { className: 'detail-backdrop', onClick: onClose });

  container.append(backdrop, el('div', { className: 'detail-modal' }, [form]));
}

function labeled(labelText, inputNode) {
  return el('label', { className: 'detail-field' }, [el('span', { className: 'detail-label', text: labelText }), inputNode]);
}

function renderChecklist(todo, onToggleChecklistItem, onRemoveChecklistItem, onAddChecklistItem) {
  const items = el(
    'ul',
    { className: 'checklist' },
    todo.checklist.map((item) => {
      const checkbox = el('input', {
        type: 'checkbox',
        checked: item.completed,
        onClick: () => onToggleChecklistItem(todo.id, item.id),
      });
      const text = el('span', { className: `checklist-text${item.completed ? ' completed' : ''}`, text: item.text });
      const removeButton = el('button', {
        type: 'button',
        className: 'checklist-remove-btn',
        text: '✕',
        onClick: () => onRemoveChecklistItem(todo.id, item.id),
      });
      return el('li', { className: 'checklist-item' }, [checkbox, text, removeButton]);
    })
  );

  const newItemInput = el('input', { type: 'text', className: 'checklist-input', placeholder: 'Add checklist item' });
  const addItemButton = el('button', {
    type: 'button',
    className: 'checklist-add-btn',
    text: '+ Add',
    onClick: () => {
      const text = newItemInput.value.trim();
      if (!text) return;
      onAddChecklistItem(todo.id, text);
      newItemInput.value = '';
    },
  });

  return el('div', { className: 'detail-field checklist-section' }, [
    el('span', { className: 'detail-label', text: 'Checklist' }),
    items,
    el('div', { className: 'checklist-add-row' }, [newItemInput, addItemButton]),
  ]);
}
