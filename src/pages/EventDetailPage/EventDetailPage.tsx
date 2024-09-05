import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventComplete } from "../../types/supabase-types-own";
import supabaseClient from "../../lib/supabaseClient";
import "./EventDetailPage.css";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";
import { useUserContext } from "../../context/UserContext";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventComplete | null>(null);
  const userContext = useUserContext();
  const user = userContext?.user;

  if (!user) {
    return null;
  }

  const navigate = useNavigate();

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
  }, [id]);

  const addFavorite = async (eventId: string) => {
    const favoritesInsertResponse = await supabaseClient
      .from("favorites")
      .insert({ user_id: user?.id, event_id: eventId });

    if (favoritesInsertResponse.error) {
      console.error("Error setting favorite", favoritesInsertResponse.error.message);
      return;
    } else {
      setEvent((prevEvent) => {
        if (prevEvent) {
          const updatedFavorites = [
            ...(prevEvent.favorites ?? []),
            { event_id: eventId, user_id: user!.id, id: "", created_at: "" },
          ];
          return { ...prevEvent, favorites: updatedFavorites };
        }
        return prevEvent;
      });
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
      setEvent((prevEvent) => {
        if (prevEvent) {
          const newFavoritesWithoutEvent = (prevEvent.favorites ?? []).filter(
            (fav) => fav.event_id !== eventId
          );
          return { ...prevEvent, favorites: newFavoritesWithoutEvent };
        }
        return prevEvent;
      });
    }
  };

  return (
    <main className="event-detail-container">
      <div className="event-detail-header">
        <button className="prev-btn" onClick={() => navigate(-1)}>
          <img src="/prev-btn.png" alt="go to previous page" />
        </button>
        <h2>Event Details</h2>
        <button className="favorites-button"
          onClick={() => {
            const isFavorite = event?.favorites?.some(
              (favorite) => favorite.event_id === event!.id
            );
            if (isFavorite) {
              deleteFavorite(event!.id);
            } else {
              addFavorite(event!.id);
            }
          }}
        >
          {event?.favorites?.some((favorite) => favorite.event_id === event.id) ? (
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
