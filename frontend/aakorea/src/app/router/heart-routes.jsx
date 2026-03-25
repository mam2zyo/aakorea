import { Route } from "react-router-dom";
import HeartHomePage from "../../domains/heart/home/HeartHomePage";

export default function HeartRoutes() {
  return <Route index element={<HeartHomePage />} />;
}
