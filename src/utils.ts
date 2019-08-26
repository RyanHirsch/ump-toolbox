import { intersection } from "ramda";

import { ParsedTrackEvent } from "../types/event";

export function computeSuperProperties(events: ParsedTrackEvent[]) {
  const eventTypes = new Set<string>();
  events.forEach(ev => eventTypes.add(ev.event));

  if (eventTypes.size > 1) {
    let sup = Object.keys(events[0].properties);
    events.forEach(ev => {
      const props = Object.keys(ev.properties);
      sup = intersection(sup, props);
    });
    return sup; /*?*/
  }
  return [];
}

export function getDetails(
  events: ParsedTrackEvent[],
  event: ParsedTrackEvent
) {
  const superProperties = computeSuperProperties(events);

  return Object.entries(event.properties).reduce(
    ({ eventProps, superProps }, [key, val]) => {
      if (superProperties.includes(key)) {
        return {
          eventProps,
          superProps: {
            ...superProps,
            [key]: val
          }
        };
      }
      return {
        superProps,
        eventProps: {
          ...eventProps,
          [key]: val
        }
      };
    },
    {
      eventProps: {},
      superProps: {}
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
