import { Route } from "react-router-dom";
import HomePage from "../../domains/basic/home/HomePage";
import PublicContentPage from "../../domains/basic/content/PublicContentPage";
import MeetingSearchPage from "../../domains/basic/meeting-search/MeetingSearchPage";
import GroupDetailPage from "../../domains/basic/group-detail/GroupDetailPage";
import GsoPage from "../../domains/basic/gso/GsoPage";

export default function PublicRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="welcome" element={<PublicContentPage pageKey="welcome" />} />
      <Route path="about" element={<PublicContentPage pageKey="about" />} />
      <Route path="guide" element={<PublicContentPage pageKey="guide" />} />
      <Route path="faq" element={<PublicContentPage pageKey="faq" />} />
      <Route path="gso" element={<GsoPage />} />
      <Route path="meetings" element={<MeetingSearchPage />} />
      <Route path="groups/:groupId" element={<GroupDetailPage />} />
    </>
  );
}
