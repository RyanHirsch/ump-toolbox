import { intersection } from "ramda";
import produce from "immer";

import { mpProperties } from "./data";
import { ParsedTrackEvent, EventBreakdown } from "../types/event";

const mpPropertySet = new Set<string>(mpProperties);

export function computeSuperProperties(events: ParsedTrackEvent[]) {
  const eventTypes = new Set<string>();
  events.forEach(ev => eventTypes.add(ev.event));

  if (eventTypes.size > 1) {
    let sup = Object.keys(events[0].properties);
    events.forEach(ev => {
      const props = Object.keys(ev.properties).filter(
        prop => !mpPropertySet.has(prop)
      );
      sup = intersection(sup, props);
    });
    return sup;
  }
  return [];
}

export function getDetails(
  events: ParsedTrackEvent[],
  event: ParsedTrackEvent
): EventBreakdown {
  const superProperties = computeSuperProperties(events);

  return Object.entries(event.properties).reduce(
    (result, [key, val]) => {
      if (mpPropertySet.has(key)) {
        return produce<EventBreakdown>(result, draft => {
          draft.mpProps[key] = val;
        });
      } else if (superProperties.includes(key)) {
        return produce<EventBreakdown>(result, draft => {
          draft.superProps[key] = val;
        });
      }
      return produce<EventBreakdown>(result, draft => {
        draft.eventProps[key] = val;
      });
    },
    {
      eventProps: {},
      superProps: {},
      mpProps: {}
    }
  );
}

export function getValueAsString(val: any): string {
  if (Array.isArray(val) && val.length === 0) {
    return "[]";
  }

  let asString = "";
  try {
    asString = val.toString();
  } catch (err) {
    if (val === null) {
      asString = "null";
    } else {
      console.log({ val });
    }
  }
  return asString;
}
