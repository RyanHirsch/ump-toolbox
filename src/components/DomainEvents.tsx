import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { TrackEvent } from "mixpanel-react";

import { TrackEventsContext } from "../contexts/TrackEvents";
import EventList from "./EventList";

type Matched = RouteComponentProps<{ domain: string }>;

const DomainEvents: React.FunctionComponent<Matched> = ({ match }) => {
  const domain = decodeURIComponent(match.params.domain);
  const [{ events }] = useContext(TrackEventsContext);

  const filteredEvents =
    domain === "[all]" ? events : events.filter(ev => ev.domain === domain);

  return (
    <div className="w-8/12 pl-2">
      <div>
        <Link className="p-2 rounded bg-teal-200 gray-100" to="/">
          &lt; Back
        </Link>
        <div className="ml-8 mb-3 inline-block font-medium">
          Domain {domain}
          <TrackEvent
            name="Display Domain Events"
            props={{ "Domain Name": domain }}
          />
        </div>
      </div>
      <EventList events={filteredEvents} domain={domain} />
    </div>
  );
};

export default DomainEvents;
