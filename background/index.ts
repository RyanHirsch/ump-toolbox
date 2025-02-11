import { ScrapedTrackEvent } from "../types/event";

const trackEvents: ScrapedTrackEvent[] = [];
const panelConnections = new Set<chrome.runtime.Port>();
const devToolsConnectionManager = new Map<chrome.runtime.Port, any>();

function getBase64Data(url: string): string {
  const [, qs] = url.split("?data=");
  const [data] = qs.split("&");
  return decodeURIComponent(data);
}

function broadcastEvent(event: ScrapedTrackEvent) {
  return (connection: chrome.runtime.Port) => {
    connection.postMessage({ type: "new-event", event });
  };
}

function sendExistingEvents(connection: chrome.runtime.Port) {
  connection.postMessage({
    type: "initial-events",
    events: trackEvents
  });
}

function attachPanelListener(panelConnection: chrome.runtime.Port) {
  panelConnections.add(panelConnection);
  sendExistingEvents(panelConnection);

  getUserData().then(userInfo =>
    panelConnection.postMessage({
      type: "user-info",
      data: userInfo
    })
  );

  // assign the listener function to a variable so we can remove it later
  var panelListener = (_message: any, _sender: any) => {};

  // add the listener
  panelConnection.onMessage.addListener(panelListener);

  panelConnection.onDisconnect.addListener(() => {
    panelConnections.delete(panelConnection);
    panelConnection.onMessage.removeListener(panelListener);
  });
}

function attachDevToolsListener(devToolsConnection: chrome.runtime.Port) {
  devToolsConnectionManager.set(devToolsConnection, null);

  // assign the listener function to a variable so we can remove it later
  var toolsListener = (message: any, sender: any) => {
    const removeFn = initialize(message.tabId);
    devToolsConnectionManager.set(devToolsConnection, {
      tabId: message.tabId,
      removeFn
    });
  };

  // add the listener
  devToolsConnection.onMessage.addListener(toolsListener);

  devToolsConnection.onDisconnect.addListener(() => {
    const { removeFn } = devToolsConnectionManager.get(devToolsConnection);
    removeFn();
    devToolsConnectionManager.delete(devToolsConnection);
    devToolsConnection.onMessage.removeListener(toolsListener);
  });

  devToolsConnection.postMessage({ isReady: true });
}

chrome.runtime.onConnect.addListener(connection => {
  if (connection.name === "devtools") {
    attachDevToolsListener(connection);
  }
  if (connection.name === "panel") {
    attachPanelListener(connection);
  }
});

chrome.runtime.onConnectExternal.addListener(connection => {
  attachPanelListener(connection);
});

async function getUserData() {
  const url = `https://mixpanel.com/`;
  const response = await fetch(url);
  const html = await response.text();
  let email;
  let username;
  try {
    username = html.match(/user_name: '(.*?)',/)[1];
    email = html.match(/user_email: '(.*?)',/)[1];
  } catch {
    username = "anonymous";
    email = "";
  }

  return { username, email };
}

function initialize(tabId: number) {
  const requestFilter = { urls: ["<all_urls>"], tabId };

  const listener = ({
    url,
    initiator
  }: chrome.webRequest.WebRequestBodyDetails) => {
    if (url.startsWith("https://api.mixpanel.com/track")) {
      const data = getBase64Data(url);
      const event: ScrapedTrackEvent = {
        data,
        domain: initiator,
        sentAt: Date.now()
      };
      trackEvents.push(event);
      panelConnections.forEach(broadcastEvent(event));
    }
  };

  chrome.webRequest.onBeforeRequest.addListener(listener, requestFilter, [
    "requestBody"
  ]);

  return () => chrome.webRequest.onBeforeRequest.removeListener(listener);
}
