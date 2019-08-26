import React from "react";
import ReactDOM from "react-dom";
// import { MemoryRouter } from "react-router";
import { HashRouter as Router } from "react-router-dom";
import "typeface-roboto";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { TrackEventsProvider } from "./contexts/TrackEvents";
import "./index.css";

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
