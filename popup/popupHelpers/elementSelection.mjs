
export function getAllElements() {
  const allElements = {
    // Toggle Enabled Switch
    toggle: document.querySelector('#toggle-switch'),
    toggleLabel: document.querySelector('#statusToggleLabel'),

    // Buttons
    btnOk: document.querySelector('.btn-ok'),
    btnAddNewInput: document.querySelector('#btn-add-new-input'),
    btnRemoveNewInput: document.querySelector('#btn-remove-new-input'),

    // Input containers 
    keyInputs: document.querySelectorAll('.key-input'),
    valueInputs: document.querySelectorAll('.value-input'),

    // Container for all inputs
    allValuePairsContainer: document.querySelector('.all-value-pairs-container')
  }
  return allElements;
}