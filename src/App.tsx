import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EventDetailPage from "./pages/EventDetailPage/EventDetailPage";
import Home from "./pages/Home/Home";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import { UserProvider } from "./context/UserContext";
import LogInPage from "./pages/LogInPage/LogInPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import SearchPage from "./pages/SearchPage/SearchPage";
import LikedPage from "./pages/LikedPage/LikedPage";
import Footer from "./components/Footer/Footer";
import AddEventPage from "./pages/AddEventPage/AddEventPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";



function App() {
  
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/liked" element={<LikedPage />} />
          <Route path="/addevent" element={<AddEventPage />} /> 
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
