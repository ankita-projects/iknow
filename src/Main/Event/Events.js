import React, { useCallback, useEffect, useRef, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";

import EventList from "./EventList";
import EventSpa from "./EventSpa";
import Search from "./Search";

function Events() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loader = useRef();

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  useEffect(() => {
    setEvents([]);
  }, [query]);

  useEffect(() => {
    // setIsLoading(true);
    const getEvents = async () => {
      // let response = await fetch("http://localhost:3001/events");
      let response = await fetch(
        `https://api.hel.fi/linkedevents/v1/event/?page=${page}`
      );
      let result = await response.json();
      setEvents((prev) => [...prev, ...result.data]);
      setTags(result.tags);
      setIsLoading(false);
    };
    getEvents();
  }, [query, page]);
  console.log("this is events", events);

  const handleSearch = events.filter((e) => {

    if (e.name.en) {

      return e.name.en.toLowerCase().includes(query.toLowerCase());

    } else if (e.name.fi) {

      return e.name.fi.toLowerCase().includes(query.toLowerCase());

    } else {

      return e.name.sv.toLowerCase().includes(query.toLowerCase());

    }

  });

  let { url } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={url} exact>
          <Search search={(e) => setQuery(e.target.value)} />
          {isLoading && <p>Loading...</p>}
          <section className="events">
            <EventList events={handleSearch} />
          </section>
          <div ref={loader} />
        </Route>

        <Route path={`${url}/:id`}>
          <EventSpa />
        </Route>
      </Switch>
    </>
  );
}

export default Events;
