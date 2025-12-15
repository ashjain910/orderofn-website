import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const access = Cookies.get("access");
  // You can add more logic to check token validity if needed
  return access ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
