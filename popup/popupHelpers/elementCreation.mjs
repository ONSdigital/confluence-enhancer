
// Shorthand for document.createElement()
export function crEl(el, elementId = null, elementClass = null) {
  const newElement = document.createElement(el);

  if (elementId !== null) {
    newElement.id = elementId;
  }

  if (elementClass !== null) {
    newElement.className = elementClass;
  }

  return newElement;
}

function createKeyInput(pair, i) {
  const keyInput = crEl('input', `key${i + 1}`, 'key-input');
  keyInput.type        = 'text';
  keyInput.placeholder = '$$value_to_find';
  keyInput.value = pair.key;
  return keyInput;
}

function createValueInput(pair, i) {
  const valueInput = crEl('input', `value${i + 1}`, 'value-input');
  valueInput.type        = 'text';
  valueInput.placeholder = 'replaceWithThis';
  valueInput.value = pair.value;
  return valueInput;
}

export function setupNumberOfInputsBasedOnStorage(defaultStarterSettings) {
  // Loading the current settings from storage
  chrome.storage.local.get({ settings: defaultStarterSettings }, ({ settings }) => {

    // Select the container where all value pairs will be added
    const allValuePairsContainer = document.querySelector('.all-value-pairs-container');

    // Remove all existing .values-pair-container elements
    allValuePairsContainer.querySelectorAll('.values-pair-container').forEach(node => node.remove());

    // Re-build one .values-pair-container for each pair in the settings
    settings.pairs.forEach((pair, i) => {
      // Create a new pair container
      const newPairContainer = crEl('div', null, 'values-pair-container');

      // Create the key container and input
      const keyContainer = crEl('div', null, 'input-container');
      const keyInput = createKeyInput(pair, i);
      keyContainer.appendChild(keyInput);
      newPairContainer.appendChild(keyContainer);

      // Create the value container and input
      const valueContainer = crEl('div', null, 'input-container');
      const valueInput = createValueInput(pair, i);
      valueContainer.appendChild(valueInput);

      // Add both the Key and Value inputs
      newPairContainer.appendChild(valueContainer);

      // Append the new pair container to the main container
      allValuePairsContainer.appendChild(newPairContainer);
    });
  });
}

