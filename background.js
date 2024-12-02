// background.js

// Save the current state of all tabs and windows
async function saveSession() {
  const windows = await chrome.windows.getAll({ populate: true });
  const sessionData = windows.map(window => ({
    id: window.id,
    tabs: window.tabs.map(tab => ({ url: tab.url, active: tab.active }))
  }));

  // Save the session to Chrome storage
  chrome.storage.local.set({ sessionData }, () => {
    console.log("Session saved:", sessionData);
  });
}

// Restore the last session
async function restoreSession() {
  chrome.storage.local.get("sessionData", data => {
    if (data.sessionData) {
      data.sessionData.forEach(windowData => {
        chrome.windows.create({ url: windowData.tabs.map(tab => tab.url) });
      });
      console.log("Session restored");
    } else {
      console.log("No session data found");
    }
  });
}

// Monitor tab and window changes
chrome.tabs.onUpdated.addListener(saveSession);
chrome.tabs.onRemoved.addListener(saveSession);
chrome.windows.onRemoved.addListener(saveSession);
chrome.windows.onCreated.addListener(saveSession);

// Restore session on startup
chrome.runtime.onStartup.addListener(restoreSession);

// Optional: Restore session on installation (for testing purposes)
chrome.runtime.onInstalled.addListener(restoreSession);
