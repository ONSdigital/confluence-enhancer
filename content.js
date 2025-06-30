

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
    // Load the checkbox status from local storage, if unavailable default to disabled
    const checkBoxStoredStatus = localStorage.getItem('enabledStatus');

    if (checkBoxStoredStatus === 'false' || checkBoxStoredStatus === null) {
        return;
    }

    // Now check that it's for the right URL
    const checkUrlMatches = doesUrlMatch();

    // If the URL does not match, return and do nothing
    if (!checkUrlMatches) {
        return;
    }

    // Code to execute on the page itself goes here
};

init();