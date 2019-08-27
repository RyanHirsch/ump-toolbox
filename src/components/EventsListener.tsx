import produce from "immer";
import React, { useContext, useEffect } from "react";

import { ScrapedTrackEvent, ParsedTrackEvent } from "../../types/event";
import { InitialEventsMessage, NewEventMessage } from "../../types/message";
import { TrackEventsContext, ContextProps } from "../contexts/TrackEvents";

// real-time rules?

function parseEvent(e: ScrapedTrackEvent): ParsedTrackEvent {
  const eventData = JSON.parse(atob(e.data));
  return {
    sentAt: e.sentAt,
    domain: e.domain,
    ...eventData
  };
}

const EventListener: React.FunctionComponent = () => {
  const [, setEvents] = useContext(TrackEventsContext);

  useEffect(() => {
    const backgroundPageConnection = chrome.runtime.connect({
      name: "panel"
    });

    backgroundPageConnection.onMessage.addListener(function(
      message: InitialEventsMessage | NewEventMessage
    ) {
      if (message.type === "initial-events" || message.type === "new-event") {
        setEvents(
          produce((draft: ContextProps) => {
            const processEvent = (event: ScrapedTrackEvent) => {
              if (draft.domains[event.domain]) {
                draft.domains[event.domain]++;
              } else {
                draft.domains[event.domain] = 1;
              }
              draft.events.push(parseEvent(event));
            };

            if (message.type === "initial-events") {
              message.events.forEach(processEvent);
            } else if (message.type === "new-event") {
              processEvent(message.event);
            }
          })
        );
      }
    });
  }, [setEvents]);
  return null;
};

export default EventListener;
