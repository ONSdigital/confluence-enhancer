
export function getAllElements() {
  const allElements = {
    toggle: document.querySelector('#toggle-switch'),
    btnOk: document.querySelector('.btn-ok'),

    keyInputs: document.querySelectorAll('.key-input'),
    valueInputs: document.querySelectorAll('.value-input'),
  }
  return allElements;
}