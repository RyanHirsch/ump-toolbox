import produce from "immer";
import React, { useContext } from "react";
import { NavLink, Route, Switch } from "react-router-dom";

import {
  TrackEventsContext,
  defaultState,
  ContextProps
} from "../contexts/TrackEvents";

const linkClasses =
  "m-3 py-2 px-4 bg-teal-300 rounded flex justify-between hover:bg-teal-200 shadow-md";

const domainClasses = "";
const countClasses = "ml-3";

const DomainLinks: React.FunctionComponent = () => {
  const [{ domains, events }, setTrackEvents] = useContext(TrackEventsContext);

  const ClearAll = () => (
    <button
      type="button"
      onClick={() => setTrackEvents(produce(_state => defaultState))}
    >
      Clear All Events
    </button>
  );
  const ClearMatched = ({ match, history }: any) => (
    <button
      type="button"
      onClick={() =>
        setTrackEvents(
          produce((state: ContextProps) => {
            const domainName = decodeURIComponent(match.params.domain);
            delete state.domains[domainName];
            state.events = state.events.filter(ev => ev.domain !== domainName);
            history.push("/");
          })
        )
      }
    >
      Clear Events For {decodeURIComponent(match.params.domain)}
    </button>
  );

  return (
    <div className="mx-auto  lg:w-3/12">
      <Switch>
        <Route exact path="/" component={ClearAll} />
        <Route path="/domains/[all]" component={ClearAll} />
        <Route path="/domains/:domain" component={ClearMatched} />
      </Switch>

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
