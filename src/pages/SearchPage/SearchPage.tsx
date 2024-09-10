import { useEffect, useState } from "react";
import {
  Category,
  EventComplete,
  Location,
} from "../../types/supabase-types-own";
import supabaseClient from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import UnfavoriteIcon from "../../assets/svg/UnfavoriteIcon";
import FavoriteIcon from "../../assets/svg/FavoriteIcon";
import "./SearchPage.css";
import formatEventDate from "../../services/formatEventDate";
import MusicIcon from "../../assets/svg/MusicIcon";
import FoodIcon from "../LogInPage/FoodIcon";
import SportIcon from "../../assets/svg/SportIcon";
import ArtIcon from "../LogInPage/ArtIcon";

const SearchPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [events, setEvents] = useState<EventComplete[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>("ca513963-db50-4b8a-8468-56c07b0eddc3");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const userContext = useUserContext();
  const user = userContext?.user;

  if (!user) {
    return;
  }
  if(!categories) {
    return;
  }

  useEffect(() => {
    const fetchEvents = async () => {
      let selectQuery = supabaseClient
        .from("events")
        .select("*, categories(*), locations(*), venues(*), favorites(*)")
        .eq("favorites.user_id", user.id);

      if (searchTerm) {
        selectQuery = selectQuery.ilike("event_title", `%${searchTerm}%`);
      }
      if (selectedLocation) {
        selectQuery = selectQuery.eq("location_id", selectedLocation);
      }
      if (selectedCategory) {
        selectQuery = selectQuery.eq("category_id", selectedCategory);
      }

      const result = await selectQuery;
      if (result.error) {
        setEvents([]);
      } else {
        setEvents(result.data);
      }
    };
    fetchEvents();
  }, [searchTerm, selectedLocation, selectedCategory]);

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
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      let categoriesQuery = supabaseClient.from("categories").select("*");

      const result = await categoriesQuery;

      if (result.error) {
        setCategories([]);
      } else {
        setCategories(result.data);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === categoryId ? null : categoryId
    );
  };
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

  console.log(selectedCategory)

  return (
    <>
      <header className="search-header">
        <div className="search-location">
          <h2>Current Location</h2>
          <select
            className="locationSearch"
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
        <div className="lupeContainer">
          <img className="lupe" src="/Bulb.png" alt="searchImg" />
          <input
            className="search"
            id="title-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className="categoriesButton">
          <button
            className={
              selectedCategory === "a7f45408-8240-40e4-b2b7-bcd03178bb86"
                ? "activeCategoryWithStroke"
                : ""
            }
            onClick={() =>
              handleCategoryClick("a7f45408-8240-40e4-b2b7-bcd03178bb86")
            }
          >
            <MusicIcon /> Music
          </button>
          <button
            className={
              selectedCategory === "0bf14b29-36fc-4fa7-b6db-c6b07d53e91b"
                ? "activeCategory"
                : ""
            }
            onClick={() =>
              handleCategoryClick("0bf14b29-36fc-4fa7-b6db-c6b07d53e91b")
            }
          >
            <ArtIcon /> Art
          </button>
          <button
            className={
              selectedCategory === "52a83981-a883-4c60-9886-7af4cc19e387"
                ? "activeCategory"
                : ""
            }
            onClick={() =>
              handleCategoryClick("52a83981-a883-4c60-9886-7af4cc19e387")
            }
          >
            <SportIcon /> Sport
          </button>
          <button
            className={
              selectedCategory === "208dc341-9781-4d4d-94ef-0a831c1d475a"
                ? "activeCategoryWithStroke"
                : ""
            }
            onClick={() =>
              handleCategoryClick("208dc341-9781-4d4d-94ef-0a831c1d475a")
            }
          >
            <FoodIcon /> Food
          </button>
          <button
            className={
              selectedCategory === "0b377ab7-3a6f-4a7d-af6d-24c1a9363639"
                ? "activeCategory"
                : ""
            }
            onClick={() =>
              handleCategoryClick("0b377ab7-3a6f-4a7d-af6d-24c1a9363639")
            }
          >
            <ArtIcon /> IT
          </button>
        </div>
      </header>
      <main className="seachResultContainer">
        <div className="all-events">
          {events.length === 0 && <div className="no-events"><h1>No Upcoming Events</h1><h2>There are no Events yet!</h2></div>}
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
                <Link className="link-to-event" to={`/event/${event.id}`}>
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

export default SearchPage;
