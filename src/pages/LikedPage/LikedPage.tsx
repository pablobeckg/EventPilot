import { useEffect, useState } from "react";
import { EventComplete } from "../../types/supabase-types-own";
import { useUserContext } from "../../context/UserContext";
import supabaseClient from "../../lib/supabaseClient";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import "./LikedPage.css";
import formatEventDate from "../../services/formatEventDate";
import { Link } from "react-router-dom";

const LikedPage = () => {
  const [events, setEvents] = useState<EventComplete[]>([]);
  const [likedEventIds, setLikedEventIds] = useState<string[]>([]);
  const userContext = useUserContext();
  const user = userContext?.user;
  
  

  if (!user) {
    return;
  }

  useEffect(() => {
    const fetchLikedEvents = async () => {
      let selectQuery = supabaseClient
        .from("events")
        .select("*, categories(*), locations(*), venues(*), favorites(*)")
        .eq("favorites.user_id", user.id);

      const result = await selectQuery;
      if (result.error) {
        setEvents([]);
      } else {
        setEvents(result.data);
      }

      const selectLiked = supabaseClient
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      const resultLiked = await selectLiked;

      if (resultLiked.error) {
        setEvents([]);
      } else {
        const likedIds = resultLiked.data.map(
          (liked: { event_id: string }) => liked.event_id
        );
        setLikedEventIds(likedIds);
      }
    };
    fetchLikedEvents();
  }, [user.id]);

  const favoriteEvents = events.filter((event) =>
    likedEventIds.includes(event.id)
  );

  const deleteFavorite = async (eventId: string) => {
    const favoritesDeleteResponse = await supabaseClient
      .from("favorites")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    if (favoritesDeleteResponse.error) {
      console.error("Error deleting favorite", favoritesDeleteResponse.error);
    } else {
      setEvents(events.filter((event) => event.id !== eventId));

      setLikedEventIds(likedEventIds.filter((id) => id !== eventId));
    }
  };

  return (
    <div className="liked-page-container">
      <h1>Liked Events</h1>
      {events.length === 0 ? (
        <p>No favorite events found.</p>
      ) : (
        favoriteEvents.map((event) => (
          <Link to={`event/${event.id}`}>
          <div className="event-item-style" key={event.id}>
            
            <img src={event.event_image} alt="" />
            <div className="information-container">
              <div>
                <div className="event-favorite-top">
                  <h3>{formatEventDate(`${event.event_date} ${event.event_start_time}`)}</h3>
                  <button onClick={() => deleteFavorite(event.id)}>
                    <FavoriteIcon />
                  </button>
                </div>
                <h2>{event.event_title}</h2>
              </div>

              <div className="event-location">
                <img src="/Location.png" alt="" />
                <h3>{event.locations?.location_name}</h3>
              </div>
            </div>
          </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default LikedPage;
