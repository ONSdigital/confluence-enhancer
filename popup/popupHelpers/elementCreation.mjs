
// Shorthand for document.createElement()
export function crEl(el, elementId = null, elementClass = null) {
  const newElement = document.createElement(el);

  if (elementId !== null) {
    newElement.id = elementId;
  }
  return newElement;
}

function createNewKeyValuePair() {
  const newContainer = crEl('div', null, 'values');
}
