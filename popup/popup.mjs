import { getAllElements } from './popupHelpers/elementSelection.mjs';
import { loadValues } from './popupHelpers/loadValues.mjs';
import { saveSettings } from './popupHelpers/saveValues.mjs';

const defaultStarterSettings = {
  enabled: false,

  // Default values loaded on first run
  pairs: [
    {
      key: '$$epoch_number',
      value: '118-ReplacedByStorageSettings',  
    },
  ]
};

function saveAndClose() {
  saveSettings();
  window.close();
}

function setupEventListeners() {
  const allElements = getAllElements();

  const toggle = allElements.toggle;
  const btnOk = allElements.btnOk;

  const keyInputs = allElements.keyInputs;
  const valueInputs = allElements.valueInputs;

  // Wire up change handlers
  keyInputs.forEach(el => el.addEventListener('input', saveSettings));
  valueInputs.forEach(el => el.addEventListener('input', saveSettings));
  toggle.addEventListener('change', saveSettings);

  btnOk.addEventListener('click', () => {
    saveAndClose();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();    
      saveAndClose();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // Load the values from storage, with default values provided
  loadValues(defaultStarterSettings);

  // Setup event listeners for the elements
  setupEventListeners();

});