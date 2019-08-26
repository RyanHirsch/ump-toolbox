import React from "react";
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

const propertySectionHeader = "text-lg mt-4 border-b-2 border-teal-200";
const headerClasses = "text-center text-xl";

const DisplayEvent: React.FunctionComponent<DisplayEventProps> = ({
  events,
  event
}) => {
  const { eventProps, superProps } = getDetails(events, event);

  return (
    <div>
      <header className={headerClasses}>{event.event}</header>
      <section>
        <header className={propertySectionHeader}>
          <span className="bg-teal-200 px-3 py-1">Properties</span>
        </header>
        <PropertyList item={eventProps} />
      </section>
      <section>
        <header className={propertySectionHeader}>
          <span className="bg-teal-200 px-3 py-1">Super Properties</span>
        </header>
        <PropertyList item={superProps} />
      </section>
    </div>
  );
};

export default DisplayEvent;
