import { ScrapedTrackEvent } from "./event";

export interface InitialEventsMessage {
  type: "initial-events";
  events: ScrapedTrackEvent[];
}

export interface NewEventMessage {
  type: "new-event";
  event: ScrapedTrackEvent;
}
