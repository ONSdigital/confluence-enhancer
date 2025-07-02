import { getAllElements } from './elementSelection.mjs';

function getValuesFromInputs() {
  const allElements = getAllElements();

  const keyInputs = allElements.keyInputs;
  const valueInputs = allElements.valueInputs;

  const pairs = [];

  for (let i = 0; i < keyInputs.length; i++) {
    pairs.push({
      key:   keyInputs[i].value,
      value: valueInputs[i].value
    });
  }

  return pairs;
}

function getToggleValue() {
  const allElements = getAllElements();
  return allElements.toggle.checked;
}

function buildBaseSettings() {
  const valueOfPairsToSave = getValuesFromInputs();
  const valueOfToggle = getToggleValue();

  const settings = {
    enabled: valueOfToggle, // true or false
    pairs: valueOfPairsToSave, // [ { key: '...', value: '...' }, ... ]
  };

  return settings;
}

export function saveSettingsRemovingTheLastPairOfValues() {
  const settings = buildBaseSettings();

  // Remove the last pair if it exists
  if (settings.pairs.length > 0) {
    settings.pairs.pop();
  }

  chrome.storage.sync.set({ settings });
}

export function saveSettingsWithAdditionalBlankPair() {
  const settings = buildBaseSettings();

  // Add an additional blank pair if the toggle is enabled
  settings.pairs.push({ key: '', value: '' });

  chrome.storage.sync.set({ settings });
}

export function saveSettings() {
  const settings = buildBaseSettings();

  chrome.storage.sync.set({ settings });
}

