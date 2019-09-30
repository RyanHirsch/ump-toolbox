import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import "typeface-roboto";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { TrackEventsProvider } from "./contexts/TrackEvents";
import "./index.css";

mixpanel.init("7dae801a78d8a4d65d2e5e832f50d934");
try {
  mixpanel.register({
    "App Version": chrome.runtime.getManifest().version,
    Environment: process.env.NODE_ENV
  });
} catch {
  mixpanel.register({
    "App Version": "unknown",
    Environment: process.env.NODE_ENV
  });
}

ReactDOM.render(
  <TrackEventsProvider>
    <Router>
      <App />
    </Router>
  </TrackEventsProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
