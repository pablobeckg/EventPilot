import { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabaseClient";
import { EventComplete } from "../../types/supabase-types-own";
import { Link } from "react-router-dom";
import "./Home.css"

const Home = () => {
    const [events, setEvents] = useState<EventComplete[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      let selectQuery = supabaseClient.from("events").select("*, categories(*), locations(*), venues(*), favorites(*)");

      const result = await selectQuery;
      if (result.error) {
        setEvents([]);
      } else {
        setEvents(result.data);
      }
    };
    fetchEvents();
  }, []);
  console.log(events)

  return (
  <main className="event-list-container">
    {events.length === 0 && <p>No Events yet</p>}
    {events && events.length > 0 && events.map((event) => (
        
        <article className="event-item-container" key={event.id}>
            <Link to={`event/${event.id}`}>
            <h2>{event.event_date} {event.event_start_time}</h2>
            <h1>{event.event_title}</h1>
            <h2>{event.locations?.location_name}</h2>
            </Link>
        </article>
      
    ))}
  </main>
);
};

export default Home;
