chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "reloadPage") {
        window.location.reload();
    }
});

chrome.storage.local.get(['enabledStatus'], function(data) {
    const enabled = data.enabledStatus;

    if (enabled) {
      console.log('Enabled and page loaded');
    }
});


