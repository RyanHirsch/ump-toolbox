import React, { createContext, useState } from "react";

import { ParsedTrackEvent } from "../../types/event";

export type ContextProps = {
  domains: {
    [name: string]: number;
  };
  events: ParsedTrackEvent[];
};

type UpdateContextProps = React.Dispatch<React.SetStateAction<ContextProps>>;

export const defaultState = {
  domains: {},
  events: []
};

export const TrackEventsContext = createContext<
  [ContextProps, UpdateContextProps]
>([{ domains: {}, events: [] }, () => {}]);

export const TrackEventsProvider: React.FunctionComponent = props => {
  const [state, setState] = useState<ContextProps>(defaultState);
  return (
    <TrackEventsContext.Provider value={[state, setState]}>
      {props.children}
    </TrackEventsContext.Provider>
  );
};
