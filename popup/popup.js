document.addEventListener('DOMContentLoaded', function() {
    const checkBox = document.querySelector('.toggle-input');
    const checkBoxLabel = document.querySelector('#enabledLabel');

    // Set the toggle to whatever the enabledStatus is
    chrome.storage.local.get({'enabledStatus': false}, function(result) {
      checkBox.checked = result.enabledStatus;
      if (result.enabledStatus === false) {
        checkBoxLabel.textContent = 'Disabled';
      }
    });

    function saveEnabledStatus() {
        const enabledStatus = checkBox.checked; // Assuming 'checkBox' is the checkbox element

        // Store the enabled status in chrome storage
        chrome.storage.local.set({'enabledStatus': enabledStatus}, function() {
            console.log('Enabled status saved:', enabledStatus);
        });
    }

    // Handle Toggle for App Functionality
    checkBox.addEventListener('change', function () {
        if (checkBox.checked) {
            saveEnabledStatus();
            checkBoxLabel.textContent = 'Enabled';
        } else {
            saveEnabledStatus();
            checkBoxLabel.textContent = 'Disabled';
        }
    });

    // Add click event listener to the button
    enterButton.addEventListener('click', saveAccountNumber);
});
