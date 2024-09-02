import { Tables } from "./supabase-types-gen";

export type Event = Tables<"events">;
export type Category = Tables<"categories">;
export type Favorite = Tables<"favorites">;
export type Profile = Tables<"profiles">;
export type Location = Tables<"locations">;
export type Venue = Tables<"venues">;


export type EventComplete = Event & {
    categories: Category | null;
    locations: Location | null;
    venues: Venue | null;
    favorites: Favorite[] | null;
  };
  
