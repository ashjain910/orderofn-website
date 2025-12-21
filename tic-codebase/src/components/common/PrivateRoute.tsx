import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const location = useLocation();
  const access = Cookies.get("access");
  // Prevent redirect loop: if already on login, don't redirect again
  if (!access && location.pathname === "/") {
    return <Outlet />;
  }
  return access ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
