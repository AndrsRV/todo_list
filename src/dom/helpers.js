// Small generic DOM helpers shared across view modules.

export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  const { className, text, attrs, onClick, ...rest } = options;

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  }
  if (onClick) node.addEventListener('click', onClick);

  Object.entries(rest).forEach(([key, value]) => {
    node[key] = value;
  });

  children.forEach((child) => {
    if (child) node.appendChild(child);
  });

  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
