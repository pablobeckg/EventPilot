import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EventsPage from "./pages/EventsPage/EventsPage";
import EventDetailPage from "./pages/EventsPage/EventDetailPage/EventDetailPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
