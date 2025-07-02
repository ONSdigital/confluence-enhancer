import { getAllElements } from './elementSelection.mjs';

export function saveSettings() {
  const allElements = getAllElements();

  const keyInputs = allElements.keyInputs;
  const valueInputs = allElements.valueInputs;
  const toggle = allElements.toggle;

  const pairs = [];

  for (let i = 0; i < keyInputs.length; i++) {
    pairs.push({
      key:   keyInputs[i].value,
      value: valueInputs[i].value
    });
  }

  const settings = {
    enabled: toggle.checked,
    pairs: pairs,
  };

  chrome.storage.sync.set({ settings });
}

