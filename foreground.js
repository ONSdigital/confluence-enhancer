// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

console.log('This prints to the console of the page (injected only if the page url matched)');


(async () => {
  // Main application Logic here
  const urlModuleMatcherUrl = chrome.runtime.getURL('helpers/url_matcher.mjs');
  const { doesUrlMatch } = await import(urlModuleMatcherUrl);
 
  const urlMatches = doesUrlMatch();
  if (!urlMatches) {
    console.log('URL does not match expected pattern. Exiting script.');
    return;
  }

  const moduleUrl = chrome.runtime.getURL('helpers/adjust_page.mjs');
  const { runReplacementScript } = await import(moduleUrl);

  const urlForSettingsModule = chrome.runtime.getURL('popup/popupHelpers/defaultSettings.mjs');
  const { defaultStarterSettings } = await import(urlForSettingsModule);

  chrome.storage.local.get({ settings: defaultStarterSettings }, async ({ settings }) => {
    console.log('Current settings (either default or overiden by popup):', settings);
    // Settings: {enabled: false, pairs: Array(1)} 
    const pairsToReplace = settings.pairs || [];
    runReplacementScript(pairsToReplace);
  });

})();