import { getAllElements } from './elementSelection.mjs';

export function loadToggleStatus(defaultStarterSettings) {
  const allElements = getAllElements(); 
  const toggle = allElements.toggle;

  chrome.storage.sync.get({ settings: defaultStarterSettings }, ({ settings }) => {
    toggle.checked  = settings.enabled;

  });
}

