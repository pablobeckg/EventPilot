import { useEffect } from "react";
import supabaseClient from "../../lib/supabaseClient";

const EventsPage = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      let selectQuery = supabaseClient.from("events").select("*");

      const result = await selectQuery;
      console.log(result);
    };
    fetchEvents();
  }, []);

  return <h1>Events</h1>;
};

export default EventsPage;
