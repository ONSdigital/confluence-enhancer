
export function doesUrlMatch() {
    const url = window.location.href;
    console.log('Current URL:', url);

    const expectedUrlComponents = ['https://confluence.ons.gov.uk/display', 'Load+New+Epoch+Instructions'];

    // Check if the URL contains all expected components
    const matches = expectedUrlComponents.every(component => url.includes(component));

    console.log('url:', url, 'contains all expected components:', matches);
    return matches;
}

