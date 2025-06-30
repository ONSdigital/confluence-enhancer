function getCheckboxAndLabel() {
    const checkBox = document.querySelector('.toggle-input');
    const checkBoxLabel = document.querySelector('#enabledLabel');
    return { checkBox, checkBoxLabel };
}

function setCheckboxAndLabelToEnabled() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabel();
    checkBox.checked = true;
    checkBoxLabel.textContent = 'Enabled';
    // Store the enabled status in local storage
    localStorage.setItem('enabledStatus', 'true');
};

function setCheckboxAndLabelToDisabled() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabel();
    checkBox.checked = false;
    checkBoxLabel.textContent = 'Disabled';
    // Store the enabled status in local storage
    localStorage.setItem('enabledStatus', 'false');
};

function setCurrentCheckboxStatusFromStorage() {
    const checkBoxStoredStatus = localStorage.getItem('enabledStatus');
    if (checkBoxStoredStatus === 'true') {
        setCheckboxAndLabelToEnabled();
    }
    else {
        setCheckboxAndLabelToDisabled();
    }
};

function setupEventListenersForCheckboxButton() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabel();
    checkBox.addEventListener('click', function () {
        if (checkBox.checked) {
            setCheckboxAndLabelToEnabled();
        } else {
            setCheckboxAndLabelToDisabled();
        }
    });
};

function init() {
    // Load the checkbox status from local storage, if unavailable default to disabled
    setCurrentCheckboxStatusFromStorage();

    // Setup event listeners for checkbox button
    setupEventListenersForCheckboxButton();
};


document.addEventListener('DOMContentLoaded', init);