import React, { useContext } from "react";

import { TrackEventsContext } from "../contexts/TrackEvents";
import { NavLink } from "react-router-dom";

const linkClasses =
  "m-3 py-2 px-4 bg-teal-300 rounded flex justify-between hover:bg-teal-200 shadow-md";

const domainClasses = "";
const countClasses = "ml-3";

const DomainLinks: React.FunctionComponent = () => {
  const [{ domains, events }] = useContext(TrackEventsContext);

  return (
    <div className="mx-auto  lg:w-3/12">
      <ul>
        <li>
          <NavLink
            activeClassName="font-bold"
            to={`/domains/[all]`}
            className={linkClasses}
          >
            <div className={domainClasses}>All</div>
            <div className={countClasses}>{events.length}</div>
          </NavLink>
        </li>
        {Object.entries(domains)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => (
            <li key={name}>
              <NavLink
                activeClassName="font-bold"
                to={`/domains/${encodeURIComponent(name)}`}
                className={linkClasses}
              >
                <div className={domainClasses}>{name}</div>
                <div className={countClasses}>{count}</div>
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DomainLinks;
