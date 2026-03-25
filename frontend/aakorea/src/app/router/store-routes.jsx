import { Route } from "react-router-dom";
import StoreHomePage from "../../domains/store/home/StoreHomePage";

export default function StoreRoutes() {
  return <Route index element={<StoreHomePage />} />;
}
