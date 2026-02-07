// Side panel opens on click by default if configured in action?
// We configure it to open on action click.
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

console.log('Blog Card Builder Background Service Worker loaded');
