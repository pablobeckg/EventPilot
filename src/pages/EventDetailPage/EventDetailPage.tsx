import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventComplete } from "../../types/supabase-types-own";
import supabaseClient from "../../lib/supabaseClient";
import "./EventDetailPage.css";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";
import { useUserContext } from "../../context/UserContext";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventComplete | null>(null);
  const [events, setEvents] = useState<EventComplete[]>([]);
  const userContext = useUserContext();
  const user = userContext?.user;

  useEffect(() => {
    const fetchSingleEvent = async () => {
      if (!id) {
        console.error("No event id given.");
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


  const addFavorite = async (eventId: string) => {
    const favoritesInsertResponse = await supabaseClient
      .from("favorites")
      .insert({ user_id: user?.id, event_id: eventId });

    if (favoritesInsertResponse.error) {
      console.error(
        "Error setting favorite",
        favoritesInsertResponse.error.message
      );
      return;
    } else {
      setEvents(
        events.map((event) => {
          if (event.id === eventId) {
            const updatedFavorites = [
              ...(event.favorites ?? []),
              { event_id: eventId, user_id: user!.id, id: "", created_at: "" },
            ];
            return { ...event, favorites: updatedFavorites };
          }
          return event;
        })
      );
    }
  };
  const deleteFavorite = async (eventId: string) => {
    const favoritesDeleteResponse = await supabaseClient
      .from("favorites")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user!.id);

    if (favoritesDeleteResponse.error) {
      console.error("Error deleting favorite", favoritesDeleteResponse.error);
    } else {
      setEvents(
        events.map((event) => {
          const newFavoritesWithoutEvent = (event.favorites ?? []).filter(
            (fav) => fav.event_id !== eventId
          );
          return event.id === eventId
            ? { ...event, favorites: newFavoritesWithoutEvent }
            : event;
        })
      );
    }
  };

  return (
    <main className="event-detail-container">
      <div className="event-favorite-icon">
                <button
                  onClick={() =>
                    event?.favorites?.find(
                      (favorite) => favorite.event_id === event!.id
                    )
                      ? deleteFavorite(event!.id)
                      : addFavorite(event!.id)
                  }
                >
                  {event?.favorites?.find(
                    (favorite) => favorite.event_id === event.id
                  ) ? (
                    <FavoriteIcon />
                  ) : (
                    <UnfavoriteIcon />
                  )}
                </button>
              </div>
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
