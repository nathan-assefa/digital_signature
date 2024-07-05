import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const PrivateRoutes = () => {
  let { username } = useAuth();
  return username ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
