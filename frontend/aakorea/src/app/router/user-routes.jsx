import { Route } from "react-router-dom";
import UserHomePage from "../../domains/user/my-page/UserHomePage";

export default function UserRoutes() {
  return <Route index element={<UserHomePage />} />;
}
