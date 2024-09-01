import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EventDetailPage from "./pages/EventDetailPage/EventDetailPage";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
