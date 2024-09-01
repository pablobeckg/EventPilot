import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventComplete } from "../../../types/supabase-types-own";
import supabaseClient from "../../../lib/supabaseClient";

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
        console.log(result.data);
      }
    };
    fetchSingleEvent();
  }, []);

  return <h1>{event?.event_title}</h1>;
};

export default EventDetailPage;
