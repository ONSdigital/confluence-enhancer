import { getAllElements } from './elementSelection.mjs';

export function loadValues(defaultStarterSettings) {
  const allElements = getAllElements(); 
  const toggle = allElements.toggle;

  const keyInputs = allElements.keyInputs;
  const valueInputs = allElements.valueInputs;

  chrome.storage.sync.get({ settings: defaultStarterSettings }, ({ settings }) => {
    toggle.checked   = settings.enabled;

    settings.pairs.forEach((pair, i) => {
      if (keyInputs[i])   keyInputs[i].value   = pair.key;
      if (valueInputs[i]) valueInputs[i].value = pair.value;
    });
  });
}

