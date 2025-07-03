import { getAllElements } from './elementSelection.mjs';

export function loadToggleStatus(defaultStarterSettings) {
  const allElements = getAllElements(); 

  const toggle = allElements.toggle;
  const toggleLabel = allElements.toggleLabel;

  chrome.storage.local.get({ settings: defaultStarterSettings }, ({ settings }) => {
    const enabledSetting = settings.enabled;

    toggleLabel.textContent = enabledSetting ? 'Enabled' : 'Disabled';
    toggle.checked  = enabledSetting;
  });
}

