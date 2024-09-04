import { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import "./Home.css"
import {
  EventComplete,
  Location,
} from "../../types/supabase-types-own";
import { useUserContext } from "../../context/UserContext";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";

const Home = () => {
    const [upcomingEvents, setupcomingEvents] = useState<EventComplete[]>([]);
    const [nearby, setNearby] = useState<EventComplete[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [events, setEvents] = useState<EventComplete[]>([]);
    const userContext = useUserContext();
    const user = userContext?.user;

    if (!user) {
      return;
    }

 
    useEffect(() => {
      const fetchEvents = async () => {
        let selectQuery = supabaseClient
          .from("events")
          .select("*, categories(*), locations(*), venues(*), favorites(*)")
          .order("event_date", { ascending: true });
    
        const result = await selectQuery;
        if (result.error) {
          setupcomingEvents([]);
        } else {
          setupcomingEvents(result.data);
        }
    
        let nearbyQuery = supabaseClient
          .from("events")
          .select("*, categories(*), locations(*), venues(*), favorites(*)");
    
        if (selectedLocation) {
          nearbyQuery = nearbyQuery.eq("location_id", selectedLocation);
        }
    
        const resultNearby = await nearbyQuery;
        if (resultNearby.error) {
          setNearby([]);
        } else {
          setNearby(resultNearby.data);
        }
      };
    
      fetchEvents();
    }, [selectedLocation]);
    

  useEffect(() => {
    const fetchLocations = async () => {
      let locationsQuery = supabaseClient.from("locations").select("*");

      const result = await locationsQuery;

      if (result.error) {
        setLocations([]);
      } else {
        setLocations(result.data);
      }
    };

    fetchLocations();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchEvents = async () => {
      let selectQuery = supabaseClient
        .from("events")
        .select("*, categories(*), locations(*), venues(*), favorites(*)")
        .limit(5)
        .eq("favorites.user_id", user.id);

      const result = await selectQuery;
      if (result.error) {
        setEvents([]);
      } else {
        setEvents(result.data);
      }
    };
    fetchEvents();
  }, []);

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
      setEvents(
        events.map((event) => {
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
    <>
    <div className="eventBase">
      <div className="eventTop">
        <div className="logo">
            <img src="/Logo.png" alt="Logo" />
        </div>
        <select className="locationSelection"
              name="location"
              id="location-select"
              value={selectedLocation || ""}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.location_name}
                </option>
              ))}
        </select>
      </div>
  <main className="event-list-container">
    <div>
      <h2 className="upcomingEventTitel">Upcoming Events</h2>
    </div>
    <div className="scrollEvents">
      {upcomingEvents.length === 0 && <p>No Events yet</p>}
      {upcomingEvents && upcomingEvents.length > 0 && upcomingEvents.map((event) => (
          
          <article className="event-item-container" key={event.id}>
            <img src={event.event_image} alt="EventImgPlaceholder" />
            <div className="event-item-contaier-item">
              <Link to={`event/${event.id}`}>
              <h2>{event.event_date} {event.event_start_time}</h2>
              <h1>{event.event_title}</h1>
              <div className="locationContainer"><img src="/Registered.png" alt="registeredImg" /><img className="mapPin" src="/MapPin.png" alt="mapPin" /><h2>{event.locations?.location_name}</h2></div>
              </Link>
            </div>
          </article>
        
      ))}
    </div>
    <div className="nearbyContainer">
      <h2 className="nearbyEventTitel">Nearby You</h2>
      <p>See All</p>
    </div>
    <div className="scrollEvents">
      {nearby.length === 0 && <p>No Events yet</p>}
          {nearby && nearby.length > 0 && nearby.map((event) => (
              
              <article className="event-item-container" key={event.id}>
                <img src={event.event_image} alt="EventImgPlaceholder" />
                <div className="event-item-contaier-item">
                  <Link to={`event/${event.id}`}>
                  <h2>{event.event_date} {event.event_start_time}</h2>
                  <h1>{event.event_title}</h1>
                  <div className="locationContainer"><img src="/Registered.png" alt="registeredImg" /><img className="mapPin" src="/MapPin.png" alt="mapPin" /><h2>{event.locations?.location_name}</h2></div>
                  </Link>
                </div>
              </article>
            
          ))}
    </div>
    <div className="allEventsTitel">
      <h2>all Events</h2>
    </div>
    <div className="scrollAllEvents">
        {events.length === 0 && <p>No Events yet</p>}
        {events &&
          events.length > 0 &&
          events.map((event) => (
            <article className="all-event-item-container" key={event.id}>
              <Link to={`event/${event.id}`}>
                <img src={event.event_image} alt="" />
                <div className="eventInfo">
                  <h2>
                    {event.event_date} {event.event_start_time}
                  </h2>
                  <h1>{event.event_title}</h1>
                  <div className="locationContainer">
                    <img className="mapPin" src="/MapPin.png" alt="mapPin" />
                    <h2>{event.locations?.location_name}</h2>
                  </div>
                </div>
              </Link>
              <div className="event-favorite-icon">
                <button
                  onClick={() =>
                    event.favorites?.find(
                      (favorite) => favorite.event_id === event.id
                    )
                      ? deleteFavorite(event.id)
                      : addFavorite(event.id)
                  }
                >
                  {event.favorites?.find(
                    (favorite) => favorite.event_id === event.id
                  ) ? (
                    <FavoriteIcon />
                  ) : (
                    <UnfavoriteIcon />
                  )}
                </button>
              </div>
            </article>
          ))}
    </div>

  </main>
  </div>
  </>
);
};

export default Home;
