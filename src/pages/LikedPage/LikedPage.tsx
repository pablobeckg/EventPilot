import { useEffect, useState } from "react";
import { EventComplete } from "../../types/supabase-types-own";
import { useUserContext } from "../../context/UserContext";
import supabaseClient from "../../lib/supabaseClient";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";

const LikedPage = () => {
    const [likedEvents, setLikedEvents] = useState<EventComplete[]>([]);
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
            setLikedEvents([]);
        } else {
            setLikedEvents(result.data);
        }

        const selectLiked = supabaseClient
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

        const resultLiked = await selectLiked;

        if (resultLiked.error) {
            console.error(resultLiked.error);
            setLikedEventIds([]);
          } else {
            const likedIds = resultLiked.data.map(
              (liked: { event_id: string }) => liked.event_id
            );
            setLikedEventIds(likedIds);
          }

      };
      fetchLikedEvents();
    }, [user.id, likedEvents]);

    const favoriteEvents = likedEvents.filter((event) =>
        likedEventIds.includes(event.id)
      );

      const addFavorite = async (eventId: string) => {
        const favoritesInsertResponse = await supabaseClient
          .from("favorites")
          .insert({ user_id: user.id, event_id: eventId });
    
        if (favoritesInsertResponse.error) {
          console.error(
            "Error setting favorite",
            favoritesInsertResponse.error.message
          );
          return;
        } else {
            setLikedEvents(
            likedEvents.map((event) => {
              if (event.id === eventId) {
                const updatedFavorites = [
                  ...(event.favorites ?? []),
                  { event_id: eventId, user_id: user.id, id: "", created_at: "" },
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
          .eq("user_id", user.id);
    
        if (favoritesDeleteResponse.error) {
          console.error("Error deleting favorite", favoritesDeleteResponse.error);
        } else {
            setLikedEvents(
            likedEvents.map((event) => {
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
        
        <div>
            {favoriteEvents.length === 0 ? (
                <p>No favorite events found.</p>
            ) : (
                favoriteEvents.map((event) => (
                    <div key={event.id}>
                        <h1>{event.event_title}</h1>
                        <div className="event-favorite-icon">
                            <button
                                onClick={() =>
                                    likedEventIds.includes(event.id)
                                        ? deleteFavorite(event.id)
                                        : addFavorite(event.id)
                                }
                            >
                                {likedEventIds.includes(event.id) ? (
                                    <FavoriteIcon />
                                ) : (
                                    <UnfavoriteIcon />
                                )}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
 
export default LikedPage;

