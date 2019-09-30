import React, { useContext } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router";
import { PageView } from "mixpanel-react";

import { TrackEventsContext } from "../contexts/TrackEvents";
import EventListener from "./EventsListener";
import DomainEvents from "./DomainEvents";
import DomainLinks from "./DomainLinks";

const Header = styled.h1.attrs({
  className:
    "text-3xl font-bold text-center text-gray-100 bg-teal-500 px-6 mb-2"
})``;

const Landing: React.FunctionComponent = () => {
  return null;
};

const App: React.FunctionComponent = () => {
  const [{ events }] = useContext(TrackEventsContext);

  return (
    <>
      <PageView name="MP-Toolbox" />
      <div className="w-full">
        <EventListener />
        <Header>Total Track Events: {events.length}</Header>
        <div className="flex justify-between mt-6 mx-2">
          {events.length > 0 ? (
            <DomainLinks />
          ) : (
            <div className="w-full text-center text-lg">
              No Events have been captured. This tool will only capture traffic
              bound for https://api.mixpanel.com/track when your dev tools are
              open.
            </div>
          )}
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/domains/:domain" component={DomainEvents} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default App;
