import { getAllElements } from './popupHelpers/elementSelection.mjs';
import { loadValues } from './popupHelpers/loadValues.mjs';
import { saveSettings } from './popupHelpers/saveValues.mjs';
import { setupNumberOfInputsBasedOnStorage } from './popupHelpers/elementCreation.mjs';

const defaultStarterSettings = {
  enabled: false,

  // Default values loaded on first run
  pairs: [
    {
      key: '$$epoch_number',
      value: '118-ReplacedByStorageSettings',  
    },
    {
      key: '$$epoch_date',
      value: '2023-10-01-ReplacedByStorageSettings',
    },
    {
      key: '$$epoch_time',
      value: '12:00-ReplacedByStorageSettings',
    },
    {
      key: '$$epoch_datetime',
      value: '2023-10-01T12:00:00-ReplacedByStorageSettings',
    },
  ]
};


// MAIN script 
document.addEventListener('DOMContentLoaded', () => {

  // Setup inputs and load values into them based on storage
  setupNumberOfInputsBasedOnStorage(defaultStarterSettings);

  // Load the toggle status
  loadToggleStatus(defaultStarterSettings);

  // Setup event listeners for the elements
  setupEventListeners();

});

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

