import React, { useState } from "react";
import { format } from "date-fns";

import { ParsedTrackEvent } from "../../types/event";
import DisplayEvent from "./DisplayEvent";

interface EventListProps {
  events: ParsedTrackEvent[];
}

const eventItemClasses = "text-sm my-1 mx-2 p-1 px-2";

const EventList: React.FunctionComponent<EventListProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<ParsedTrackEvent | null>(
    null
  );
  const sorted = events.sort((a, b) => a.sentAt - b.sentAt);
  const top = sorted.slice(-30).reverse();
  return (
    <div className="flex">
      <ul className="w-5/12">
        {top.map(mpe => (
          <li
            key={`${mpe.sentAt}${mpe.event}`}
            onClick={() => setSelectedEvent(mpe)}
            className={
              selectedEvent === mpe
                ? `bg-teal-200 ${eventItemClasses}`
                : eventItemClasses
            }
          >
            <span className="text-gray-800">
              {format(new Date(mpe.sentAt), "dd MMM, h:mm:ss a")}
            </span>{" "}
            - <span className="font-medium"> {mpe.event}</span>
          </li>
        ))}
      </ul>
      <div className="w-7/12">
        {selectedEvent ? (
          <button type="button" onClick={() => setSelectedEvent(null)}>
            Clear Selected Event
          </button>
        ) : (
          <div>Latest Event</div>
        )}
        <DisplayEvent
          events={sorted.slice(-50)}
          event={selectedEvent || top[0]}
        />
      </div>
    </div>
  );
};

export default EventList;
