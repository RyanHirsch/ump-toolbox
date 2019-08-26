import { ScrapedTrackEvent } from "../types/event";

const trackEvents: ScrapedTrackEvent[] = [];
const connections = new Set<chrome.runtime.Port>();

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

const requestFilter = { urls: ["<all_urls>"] };
chrome.webRequest.onBeforeRequest.addListener(
  function({ url, initiator }) {
    if (url.startsWith("https://api.mixpanel.com/track")) {
      const data = getBase64Data(url);
      const event: ScrapedTrackEvent = {
        data,
        domain: initiator,
        sentAt: Date.now()
      };
      trackEvents.push(event);
      connections.forEach(broadcastEvent(event));
    }
  },
  requestFilter,
  ["requestBody"]
);

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  connections.add(devToolsConnection);
  sendExistingEvents(devToolsConnection);

  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function(message: any, sender: any) {};

  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
    connections.delete(devToolsConnection);
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});
