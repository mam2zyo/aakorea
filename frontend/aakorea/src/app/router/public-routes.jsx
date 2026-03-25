import { Route } from "react-router-dom";
import BasicHomePage from "../../domains/basic/home/BasicHomePage";
import BasicPublicContentPage from "../../domains/basic/content/BasicPublicContentPage";
import BasicMeetingSearchPage from "../../domains/basic/meeting-search/BasicMeetingSearchPage";
import BasicGroupDetailPage from "../../domains/basic/group-detail/BasicGroupDetailPage";
import BasicGsoPage from "../../domains/basic/gso/BasicGsoPage";

export default function PublicRoutes() {
  return (
    <>
      <Route index element={<BasicHomePage />} />
      <Route
        path="welcome"
        element={<BasicPublicContentPage pageKey="welcome" />}
      />
      <Route path="about" element={<BasicPublicContentPage pageKey="about" />} />
      <Route path="guide" element={<BasicPublicContentPage pageKey="guide" />} />
      <Route path="faq" element={<BasicPublicContentPage pageKey="faq" />} />
      <Route path="gso" element={<BasicGsoPage />} />
      <Route path="meetings" element={<BasicMeetingSearchPage />} />
      <Route path="groups/:groupId" element={<BasicGroupDetailPage />} />
    </>
  );
}
