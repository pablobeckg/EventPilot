import { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabaseClient";
import { Category, Location, Venue } from "../../types/supabase-types-own";
import "./AddEventPage.css";

const AddEventPage = () => {
  const [eventName, setEventName] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [venueInput, setVenueInput] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventStartTime, setEventStartTime] = useState<string>("");
  const [eventFinishTime, setEventFinishTime] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await supabaseClient.from("categories").select("*");
      setCategories(result.error ? [] : result.data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const result = await supabaseClient.from("locations").select("*");
      setLocations(result.error ? [] : result.data);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      const result = await supabaseClient.from("venues").select("*");
      setVenues(result.error ? [] : result.data);
    };

    fetchVenues();
  }, []);

  const addLocation = async (locationName: string) => {
    const locationsInsertResponse = await supabaseClient
      .from("locations")
      .insert({ location_name: locationName })
      .select("*")
      .single();

    if (locationsInsertResponse.error) {
      console.error(
        "Error adding location",
        locationsInsertResponse.error.message
      );
      return;
    } else {
      setLocations([...locations, locationsInsertResponse.data]);
      return locationsInsertResponse.data.id;
    }
  };


  const addVenue = async (venueName: string) => {
    const venuesInsertResponse = await supabaseClient
      .from("venues")
      .insert({ venue_name: venueName })
      .select("*")
      .single();

    if (venuesInsertResponse.error) {
      console.error("Error adding venue", venuesInsertResponse.error.message);
      return;
    } else {
      setVenues([...venues, venuesInsertResponse.data]);
      return venuesInsertResponse.data.id;
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!eventImage) return;

    if (!selectedCategory) {
        setErrorMessage("Please select a category.");
        return;
      }

    const fileName = eventImage.name;
    const uploadEventImageResponse = await supabaseClient.storage
      .from("event_img")
      .upload(fileName, eventImage, { upsert: true });

    if (uploadEventImageResponse.error) {
      console.error(
        "Error uploading image",
        uploadEventImageResponse.error.message
      );
      return;
    }

    const publicUrlResponse = await supabaseClient.storage
      .from("event_img")
      .getPublicUrl(fileName);

    if (!publicUrlResponse.data) {
      console.error("Error getting public url");
      return;
    }

    let locationId = locations.find(
      (loc) => loc.location_name === locationInput.trim()
    )?.id;
    if (!locationId && locationInput.trim()) {
      locationId = await addLocation(locationInput.trim());
    }


    let venueId = venues.find(
      (ven) => ven.venue_name === venueInput.trim()
    )?.id;
    if (!venueId && venueInput.trim()) {
      venueId = await addVenue(venueInput.trim());
    }

    if (!locationId || !venueId) {
      setErrorMessage(
        "Invalid category, location, or venue. Please try again."
      );
      return;
    }

    const eventData = {
      event_title: eventName,
      event_info: about,
      category_id: selectedCategory,
      location_id: locationId,
      event_date: eventDate,
      event_start_time: eventStartTime,
      event_finish_time: eventFinishTime,
      event_image: publicUrlResponse.data.publicUrl,
      venue_id: venueId,
    };

    const response = await supabaseClient
      .from("events")
      .insert(eventData)
      .select("*")
      .single();

    if (response.error) {
      console.error("Error creating event", response.error.message);
      setErrorMessage("Failed to create event. Please try again.");
    } else {
      setSuccessMessage("Event created successfully!");
      setEventName("");
      setLocationInput("");
      setSelectedCategory(null);
      setVenueInput("");
      setEventDate("");
      setEventStartTime("");
      setEventFinishTime("");
      setAbout("");
      setEventImage(null);
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add Event</h2>
      <form className="signup-form" onSubmit={handleAddEvent}>
        <div className="upload-container">
          <label>Upload event image:</label>
          <br />
          <input
            type="file"
            className="input-file"
            accept="image/*"
            name="image"
            onChange={(e) => {
              if (e.target.files) {
                setEventImage(e.target.files[0]);
              }
            }}
          />
        </div>

        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Name"
          name="name"
          required
        />
         <select
          name="category"
          id="category-select"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          placeholder="Date"
          name="date"
          required
        />
        <input
          type="time"
          value={eventStartTime}
          onChange={(e) => setEventStartTime(e.target.value)}
          placeholder="Start Time"
          name="start-time"
          required
        />
        <input
          type="text"
          value={venueInput}
          onChange={(e) => setVenueInput(e.target.value)}
          placeholder="Venue"
          name="venue"
          required
        />
        <input
          type="time"
          value={eventFinishTime}
          onChange={(e) => setEventFinishTime(e.target.value)}
          placeholder="Finish Time"
          name="finish-time"
          required
        />
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Location"
          name="location"
          required
        />
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About"
          name="about"
          rows={5}
          maxLength={1000}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">ADD</button>
      </form>
    </div>
  );
};

export default AddEventPage;
