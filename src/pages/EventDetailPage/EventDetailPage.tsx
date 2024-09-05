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
        .select("*, categories(*), locations(*), venues(*), favorites(*)")
        .eq("id", id)
        .single();

      const result = await selectQuery;
      if (result.error) {
        setEvent(null);
      } else {
        setEvent(result.data);
      }
      
    };
    fetchSingleEvent();
  }, []);

  return (
    <main className="event-detail-container">
      <div className="single-event-img-container">
      <img src={event?.event_image} alt="EventImgPlaceholder" />
      </div>
      <div className="single-event-interest-container">
      <img src="/also-registered.png" alt="registeredImg" />
      </div>
      <div className="single-event-detail-wrapper">
      <h2>{event?.event_title}</h2>
      <div className="single-event-date-time-container">
        <div className="single-event-icon date-icon"></div>
        <div className="single-event-date-info-text">
      <p><b>{event?.event_date}</b></p>
      <p>{event?.event_start_time} - {event?.event_finish_time}</p>
      </div>
      </div>
      <div className="single-event-venue-location-container">
      <div className="single-event-icon location-icon"></div>
      <div className="single-event-location-info-text">
      <p><b>{event?.venues?.venue_name}</b></p>
      <p>{event?.locations?.location_name}</p>
      </div>
      </div>
      <div className="single-event-detail-text">
        <p><b>About Event</b></p>
        <p>{event?.event_info}</p>
      </div>
      </div>
    </main>
  );
};

export default EventDetailPage;
