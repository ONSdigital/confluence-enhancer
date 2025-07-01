// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log('This prints to the console of the page (injected only if the page url matched)');


function doesUrlMatch() {
    const url = window.location.href;
    console.log('Current URL:', url);

    const expectedUrlComponents = ['https://confluence.ons.gov.uk/display', 'Load+New+Epoch+Instructions'];

    // Check if the URL contains all expected components
    const matches = expectedUrlComponents.every(component => url.includes(component));

    console.log('url:', url, 'contains all expected components:', matches);
    return matches;
}

(async () => {
  // Main application Logic here

  const urlMatches = doesUrlMatch();
  if (!urlMatches) {
    console.log('URL does not match expected pattern. Exiting script.');
    return;
  }

  console.log('Now importing replacement script...');
  const moduleUrl = chrome.runtime.getURL('helpers/adjust_page.mjs');
  const { runReplacementScript } = await import(moduleUrl);
  runReplacementScript();

})();