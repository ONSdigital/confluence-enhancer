import { getAllElements } from './popupHelpers/elementSelection.mjs';
import { loadToggleStatus } from './popupHelpers/loadValues.mjs';
import { saveSettings, saveSettingsWithAdditionalBlankPair, saveSettingsRemovingTheLastPairOfValues } from './popupHelpers/saveValues.mjs';
import { setupNumberOfInputsBasedOnStorage } from './popupHelpers/elementCreation.mjs';
import { defaultStarterSettings } from './popupHelpers/defaultSettings.mjs';

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
  const allValuePairsContainer = allElements.allValuePairsContainer;

  const btnAddNewInput = allElements.btnAddNewInput;
  const btnRemoveNewInput = allElements.btnRemoveNewInput;

  // Wire up change handlers
  keyInputs.forEach(el => el.addEventListener('input', saveSettings));
  valueInputs.forEach(el => el.addEventListener('input', saveSettings));
  toggle.addEventListener('change', () => {
    saveSettings();
    loadToggleStatus(defaultStarterSettings); // Reload to update the label
  });

  btnOk.addEventListener('click', () => {
    saveAndClose();
  });

  btnAddNewInput.addEventListener('click', () => {
    // Add a new input pair to the storage
    saveSettingsWithAdditionalBlankPair();
    setupNumberOfInputsBasedOnStorage(defaultStarterSettings);
    setupEventListeners();
  });

  btnRemoveNewInput.addEventListener('click', () => {
    // Remove the last input pair from the storage
    saveSettingsRemovingTheLastPairOfValues();
    setupNumberOfInputsBasedOnStorage(defaultStarterSettings);
    setupEventListeners();
  });

  // Apply to the stuff inside the allValuePairsContainer (just the input boxes)
  allValuePairsContainer.addEventListener('keyup', (e) => {
    if (e.target.matches('input[type="text"]')) {
      saveSettings(); // save after every keystroke

      // If enter is pressed close as well
      if (e.key === 'Enter') {
        e.preventDefault();
        saveAndClose();
      }
    }

  });
}

