const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools"
});

const backgroundMessageReceived = (_message: any) => {};

backgroundPageConnection.onMessage.addListener(backgroundMessageReceived);

chrome.devtools.panels.create(
  "Unofficial Mixpanel Toolbox",
  "icon128.png",
  "index.html",
  () => {
    backgroundPageConnection.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  }
);
