function getCheckboxAndLabelElements() {
    const checkBox = document.querySelector('.toggle-input');
    const checkBoxLabel = document.querySelector('#enabledLabel');
    return { checkBox, checkBoxLabel };
}

function setCheckboxAndLabelToEnabled() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabelElements();
    checkBox.checked = true;
    checkBoxLabel.textContent = 'Enabled';

    // Store in chrome.storage
    chrome.storage.local.set({'confluenceEnhancerEnabledStatus': 'true'}, function() {
        console.log('confluenceEnhancerEnabledStatus set to:', 'true');
    });
};

function setCheckboxAndLabelToDisabled() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabelElements();
    checkBox.checked = false;
    checkBoxLabel.textContent = 'Disabled';

    // Store in chrome.storage
    chrome.storage.local.set({'confluenceEnhancerEnabledStatus': 'false'}, function() {
        console.log('confluenceEnhancerEnabledStatus set to:', 'false');
    });
};

function setCurrentCheckboxStatusFromStorage() {
    // Get the status of the checkbox from chrome.storage, assume flase if not set
    chrome.storage.local.get({'confluenceEnhancerEnabledStatus': 'false'}, function(localStorageData) {
        const currentlyEnabled = localStorageData.confluenceEnhancerEnabledStatus; // 'true' or 'false'
        if (currentlyEnabled === 'true') {
            setCheckboxAndLabelToEnabled();
        }  else {
            setCheckboxAndLabelToDisabled();
        }
    });
};

function setupEventListenersForCheckboxButton() {
    const { checkBox, checkBoxLabel } = getCheckboxAndLabelElements();
    checkBox.addEventListener('click', function () {
        if (checkBox.checked) {
            setCheckboxAndLabelToEnabled();
        } else {
            setCheckboxAndLabelToDisabled();
        }
    });
};

function initPopup() {
    // Load the checkbox status from local storage, if unavailable default to disabled
    setCurrentCheckboxStatusFromStorage();

    // Setup event listeners for checkbox button
    setupEventListenersForCheckboxButton();
};


document.addEventListener('DOMContentLoaded', initPopup);