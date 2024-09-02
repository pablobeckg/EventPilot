import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

// * wir wollen eine Zentrale Komponente, die bei jeder Route prüft, ob es einen User
// * im aktuellen Kontext (=jemand ist eingeloggt) gibt und wenn nicht immer direkt zur Login-Seite weiterleitet
const PrivateRoute = () => {
  const userContext = useUserContext();
  const user = userContext?.user;
  const loading = userContext?.loading;

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;