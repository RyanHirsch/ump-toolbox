import React from "react";
import { Redirect } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { isEmpty } from "ramda";

import { getDetails, getValueAsString } from "../utils";
import { ParsedTrackEvent } from "../../types/event";

interface PropertyValueProps {
  value: any;
}

const PropertyValue: React.FunctionComponent<PropertyValueProps> = ({
  value
}) => {
  return <span>{getValueAsString(value)}</span>;
};

interface PropertyListProps {
  [key: string]: any;
}

const propertyListClass = "";
const propertyNameClass = "w-5/12 inline-block";
const propertyValueClass = "w-7/12 inline-block";

const PropertyList: React.FunctionComponent<PropertyListProps> = ({ item }) => {
  return (
    <dl className={propertyListClass}>
      {Object.entries(item).map(([prop, val]) => (
        <React.Fragment key={prop}>
          <dt className={propertyNameClass}>{prop}</dt>
          <dd className={propertyValueClass}>
            <PropertyValue value={val} />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

interface DisplayEventProps {
  events: ParsedTrackEvent[];
  event: ParsedTrackEvent;
}

const DisplayEvent: React.FunctionComponent<DisplayEventProps> = ({
  events,
  event
}) => {
  if (!event) {
    return <Redirect to="/" />;
  }
  const { eventProps, superProps, mpProps } = getDetails(events, event);
  const defaultIndex = [eventProps, superProps, mpProps].findIndex(
    props => !isEmpty(props)
  );

  return (
    <div>
      <header className="text-center text-xl mb-4">{event.event}</header>

      <Tabs
        selectedTabClassName="bg-teal-200"
        disabledTabClassName="text-gray-500"
        defaultIndex={defaultIndex}
        key={event.sentAt}
      >
        <TabList className="px-2 text-lg border-b-2 border-teal-200 flex items-center">
          <Tab className="px-3 py-1" disabled={isEmpty(eventProps)}>
            Properties
          </Tab>
          <Tab className="px-3 py-1" disabled={isEmpty(superProps)}>
            Super Properties
          </Tab>
          <Tab className="px-3 py-1" disabled={isEmpty(mpProps)}>
            Mixpanel Properties
          </Tab>
        </TabList>
        <TabPanel>
          <PropertyList item={eventProps} />
        </TabPanel>
        <TabPanel>
          <PropertyList item={superProps} />
        </TabPanel>
        <TabPanel>
          <PropertyList item={mpProps} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DisplayEvent;
