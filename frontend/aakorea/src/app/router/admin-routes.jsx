import { Route } from "react-router-dom";
import AdminPortalHomePage from "../admin/AdminPortalHomePage";

export default function AdminRoutes() {
  return <Route index element={<AdminPortalHomePage />} />;
}
