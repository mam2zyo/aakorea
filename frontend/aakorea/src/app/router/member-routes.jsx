import { Route } from "react-router-dom";
import MemberHomePage from "../../domains/member/my-page/MemberHomePage";

export default function MemberRoutes() {
  return <Route index element={<MemberHomePage />} />;
}
