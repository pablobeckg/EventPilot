import { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import "./Home.css";
import { EventComplete, Location } from "../../types/supabase-types-own";
import { useUserContext } from "../../context/UserContext";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";
import formatEventDate from "../../services/formatEventDate";
import { formatDate } from "../../services/formatDate";

{/*const eventDate = "2024-09-25";
const { day, month } = formatDate(eventDate); */}

const Home = () => {
  const [upcomingEvents, setupcomingEvents] = useState<EventComplete[]>([]);
  const [nearby, setNearby] = useState<EventComplete[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    "ca513963-db50-4b8a-8468-56c07b0eddc3"
  );
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
      <header className="home-header">
        <img className="home-header-image" src="/Logo.png" alt="Logo" />
        <div className="select-location">
          <h2>Current Location</h2>
          <select
            className="locationSelection"
            name="location"
            id="location-select"
            value={selectedLocation || ""}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="event-list-container">
        <section className="upcoming-events">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="scroll-to-right">
            {upcomingEvents.length === 0 && <p>No Events yet</p>}
            {upcomingEvents &&
              upcomingEvents.length > 0 &&
              upcomingEvents.map((event) => (
                <Link to={`event/${event.id}`}>
                  <article className="event-item-container" key={event.id}>
                    <div
                      className="event-image-and-date"
                      style={{
                        backgroundImage: `url(${event.event_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="date-for-image">
                        <h2>{event.event_date.split("-")[2]}</h2>
                        <h3>{`${new Date(event.event_date).toString().split(" ")[1]}`}</h3>
                      </div>
                    </div>

                    <div className="item-information">
                      <h1>{event.event_title}</h1>
                      <div className="locationContainer">
                        <img
                          className="event-followers"
                          src="/Registered.png"
                          alt="registeredImg"
                        />
                        <img
                          className="mapPin"
                          src="/MapPin.png"
                          alt="mapPin"
                        />
                        <h2>{event.locations?.location_name}</h2>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </section>

        <section className="upcoming-events">
          <div className="nearby-seeall">
            <h2 className="section-title">Nearby You</h2>
            <p>See All</p>
          </div>
          <div className="scroll-to-right">
            {nearby.length === 0 && <p>No Events yet</p>}
            {nearby &&
              nearby.length > 0 &&
              nearby.map((event) => (
                <Link to={`event/${event.id}`}>
                  <article className="event-item-container" key={event.id}>
                    <div
                      className="event-image-and-date"
                      style={{
                        backgroundImage: `url(${event.event_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="date-for-image">
                      <h2>{event.event_date.split("-")[2]}</h2>
                      <h3>{`${new Date(event.event_date).toString().split(" ")[1]}`}</h3>
                      </div>
                    </div>

                    <div className="item-information">
                      <h1>{event.event_title}</h1>
                      <div className="locationContainer">
                        <img
                          className="event-followers"
                          src="/Registered.png"
                          alt="registeredImg"
                        />
                        <img
                          className="mapPin"
                          src="/MapPin.png"
                          alt="mapPin"
                        />
                        <h2>{event.locations?.location_name}</h2>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </section>
        <div className="allEventsTitel">
          <h2 className="section-title">All Events</h2>
        </div>
        <div className="all-events">
          {events.length === 0 && <p>No Events yet</p>}
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <div className="event-item-style" key={event.id}>
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
                <Link className="link-to-event" to={`event/${event.id}`}>
                  <img src={event.event_image} alt="" />
                  <div className="information-container">
                    <div>
                      <div className="event-favorite-top">
                        <h3>
                          {formatEventDate(
                            `${event.event_date} ${event.event_start_time}`
                          )}
                        </h3>
                      </div>

                      <h2>{event.event_title}</h2>
                    </div>
                    <div className="event-location">
                      <img src="/Location.png" alt="" />
                      <h3>{event.locations?.location_name}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Home;
