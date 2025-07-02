document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#toggle-switch');
  const btnOk = document.querySelector('.btn-ok');

  const key1Input = document.querySelector('#key1');
  const value1Input= document.querySelector('#value1');

  // 1) Load existing settings (or defaults)
  chrome.storage.sync.get({ settings: {} }, ({ settings }) => {
    toggle.checked   = settings.enabled || false;

    key1Input.value = settings.key1Input || '';
    value1Input.value = settings.value1Input || '';
  });

  // 2) A single function that writes *all* current settings back to storage
  function saveSettings() {
    const settings = {
      enabled: toggle.checked,

      key1Input:  key1Input.value,
      value1Input:  value1Input.value,
    };
    chrome.storage.sync.set({ settings });
  }

  // 3) Wire up change handlers
  key1Input.addEventListener('input',  saveSettings);
  value1Input.addEventListener('input',  saveSettings);
  toggle.addEventListener('change', saveSettings);

  btnOk.addEventListener('click', () => {
    saveSettings();
    window.close();
  });
});