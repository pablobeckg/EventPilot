import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventComplete } from "../../types/supabase-types-own";
import supabaseClient from "../../lib/supabaseClient";
import "./EventDetailPage.css";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventComplete | null>(null);

  useEffect(() => {
    const fetchSingleEvent = async () => {
      if (!id) {
        console.error("No quiz id given.");
        return;
      }
      let selectQuery = supabaseClient
        .from("events")
        .select("*, categories(*), locations(*), venues(*)")
        .eq("id", id)
        .single();

      const result = await selectQuery;
      if (result.error) {
        setEvent(null);
      } else {
        setEvent(result.data);
        console.log(result)
      }
      
    };
    fetchSingleEvent();
  }, []);

  return (
    <main className="event-detail-container">
      <h1>{event?.event_title}</h1>
      <h2>{event?.event_date}</h2>
      <h2>{event?.event_start_time}{event?.event_finish_time}</h2>
      <h2>{event?.venues?.venue_name}</h2>
      <h2>{event?.locations?.location_name}</h2>
    </main>
  );
};

export default EventDetailPage;
