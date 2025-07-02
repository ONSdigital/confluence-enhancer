const defaultStarterSettings = {
  enabled: false,

  pairs: [
    {
      key: '$$epoch_number',
      value: '118-ReplacedByStorageSettings',  
    },
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#toggle-switch');
  const btnOk = document.querySelector('.btn-ok');

  const keyInputs = document.querySelectorAll('.key-input');
  const valueInputs = document.querySelectorAll('.value-input');

  // 1) Load existing settings (or defaults)
  chrome.storage.sync.get({ settings: defaultStarterSettings }, ({ settings }) => {
    toggle.checked   = settings.enabled;

    settings.pairs.forEach((pair, i) => {
      if (keyInputs[i])   keyInputs[i].value   = pair.key;
      if (valueInputs[i]) valueInputs[i].value = pair.value;
    });
  });

  // 2) A single function that writes *all* current settings back to storage
  function saveSettings() {
    const keyInputs = document.querySelectorAll('.key-input');
    const valueInputs = document.querySelectorAll('.value-input');
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

  // 3) Wire up change handlers
  keyInputs.forEach(el => el.addEventListener('input', saveSettings));
  valueInputs.forEach(el => el.addEventListener('input', saveSettings));
  toggle.addEventListener('change', saveSettings);

  btnOk.addEventListener('click', () => {
    saveSettings();
    window.close();
  });

  document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();    
    saveSettings();
    window.close();
    }
  });
});