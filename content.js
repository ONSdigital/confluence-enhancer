
function doesUrlMatch() {
    const url = new URL(window.location.href);
    return (
        url.origin === 'https://confluence.ons.gov.uk' &&
        url.pathname === '/pages/viewpage.action' &&
        url.searchParams.get('spaceKey') === 'IMS' &&
        url.searchParams.get('title') === 'Load New Epoch Instructions'
    );
}

function init() {
    console.log('Confluence Enhancer: Initializing content script.');

    chrome.storage.local.get({ confluenceEnhancerEnabled: 'false' }, function(data) {
        const enabledStatus = data.confluenceEnhancerEnabledStatus; // 'true' or 'false'
        console.log('ENABLED STATUS IS:', enabledStatus);
        console.log('TYPE OF STATUS IS:', typeof enabledStatus);
        if (enabledStatus === 'false') {
            console.log('Confluence Enhancer: Content script is in the disabled status.');
            return; // Exit if the enhancer is not enabled
        }
    });

    // Code to execute on the page itself goes here
    runReplacementScript();
    console.log('End of Confluence Enhancer content script execution.');
};



// START of replacement script
const variables = {
  epoch_number: '116-Success!',
};

// 2) Walk all text nodes under `root` and replace $$VAR with variables[VAR]
function replacePlaceholders(root = document.body) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    // only bother if there's at least one $$… in this text
    if (!/\$\$\w+/.test(node.nodeValue)) continue;

    const newText = node.nodeValue.replace(
      /\$\$(\w+)/g,
      (_, varName) =>
        // if you haven't defined that var yet, leave it untouched
        variables.hasOwnProperty(varName)
          ? variables[varName]
          : `$$${varName}`
    );

    if (newText !== node.nodeValue) {
      node.nodeValue = newText;
    }
  }
}

function runReplacementScript() {
  // 3) Run once on page load
  if (window.AJS && AJS.toInit) {
    AJS.toInit(() => replacePlaceholders());
  } else {
    document.addEventListener('DOMContentLoaded', () => replacePlaceholders());
  }

  // 4) (Optional) Watch for any new nodes added later—keeps macros, AJAX, etc. in sync
  const observer = new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          // text node was added directly
          replacePlaceholders(node.parentNode);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // some element subtree was added
          replacePlaceholders(node);
        }
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

};
// END of replacement script


init();