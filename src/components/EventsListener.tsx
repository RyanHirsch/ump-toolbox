import produce from "immer";
import React, { useContext, useEffect } from "react";
import mixpanel from "mixpanel-browser";

import { ScrapedTrackEvent, ParsedTrackEvent } from "../../types/event";
import { UserInfoMessage } from "../../types/user";
import { InitialEventsMessage, NewEventMessage } from "../../types/message";
import { TrackEventsContext, ContextProps } from "../contexts/TrackEvents";

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
    const extensionId: string = "lfknbnahagadakdbgmmpcjkaflppclcg";
    const backgroundPageConnection =
      process.env.NODE_ENV === "development"
        ? chrome.runtime.connect(extensionId)
        : chrome.runtime.connect({
            name: "panel"
          });

    backgroundPageConnection.onMessage.addListener(function(
      message: InitialEventsMessage | NewEventMessage | UserInfoMessage
    ) {
      if (message.type === "initial-events" || message.type === "new-event") {
        setEvents(
          produce(({ domains, events }: ContextProps) => {
            const processEvent = (event: ScrapedTrackEvent) => {
              if (domains[event.domain]) {
                domains[event.domain]++;
              } else {
                domains[event.domain] = 1;
              }
              events.push(parseEvent(event));
            };

            if (message.type === "initial-events") {
              message.events.forEach(processEvent);
            } else if (message.type === "new-event") {
              processEvent(message.event);
            }
          })
        );
      } else if (message.type === "user-info") {
        if (message.data.email) {
          mixpanel.identify(message.data.email);
        }
        mixpanel.register({
          "User Name": message.data.username,
          "User Email": message.data.email
        });
      }
    });
  }, [setEvents]);
  return null;
};

export default EventListener;
