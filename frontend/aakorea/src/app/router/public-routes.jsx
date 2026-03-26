import { Navigate, Route } from "react-router-dom";
import BasicHomePage from "../../domains/general/public/home/BasicHomePage";
import BasicPublicContentPage from "../../domains/general/public/content/BasicPublicContentPage";
import BasicMeetingSearchPage from "../../domains/general/public/meeting-search/BasicMeetingSearchPage";
import BasicGroupDetailPage from "../../domains/general/public/group-detail/BasicGroupDetailPage";
import BasicGsoPage from "../../domains/general/public/gso/BasicGsoPage";

export default function PublicRoutes() {
  return (
    <>
      <Route index element={<BasicHomePage />} />
      <Route
        path="welcome"
        element={<BasicPublicContentPage pageKey="welcome" />}
      />
      <Route path="about" element={<BasicPublicContentPage pageKey="about" />} />
      <Route
        path="about/is-aa-for-you"
        element={<BasicPublicContentPage pageKey="isAaForYou" />}
      />
      <Route
        path="about/newcomer-questions"
        element={<BasicPublicContentPage pageKey="newcomerQuestions" />}
      />
      <Route
        path="about/first-visit"
        element={<BasicPublicContentPage pageKey="firstVisit" />}
      />
      <Route
        path="about/young-people"
        element={<BasicPublicContentPage pageKey="youngPeople" />}
      />
      <Route
        path="about/women"
        element={<BasicPublicContentPage pageKey="women" />}
      />
      <Route
        path="about/44-questions"
        element={<BasicPublicContentPage pageKey="questions44" />}
      />
      <Route
        path="about/anonymity"
        element={<BasicPublicContentPage pageKey="anonymity" />}
      />
      <Route
        path="about/professionals"
        element={<BasicPublicContentPage pageKey="professionals" />}
      />
      <Route path="guide" element={<BasicPublicContentPage pageKey="guide" />} />
      <Route path="faq" element={<BasicPublicContentPage pageKey="faq" />} />
      <Route
        path="events"
        element={<BasicPublicContentPage pageKey="events" />}
      />
      <Route
        path="resources"
        element={<BasicPublicContentPage pageKey="resources" />}
      />
      <Route
        path="resources/fact-file"
        element={<BasicPublicContentPage pageKey="factFile" />}
      />
      <Route
        path="library"
        element={<BasicPublicContentPage pageKey="literature" />}
      />
      <Route path="gso" element={<BasicGsoPage />} />
      <Route path="meetings" element={<BasicMeetingSearchPage />} />
      <Route path="groups/:groupId" element={<BasicGroupDetailPage />} />
      <Route path="event" element={<Navigate to="/events" replace />} />
      <Route path="event.html" element={<Navigate to="/events" replace />} />
      <Route path="members" element={<Navigate to="/resources" replace />} />
      <Route path="members.html" element={<Navigate to="/resources" replace />} />
      <Route
        path="assets"
        element={<Navigate to="/resources/fact-file" replace />}
      />
      <Route
        path="assets.html"
        element={<Navigate to="/resources/fact-file" replace />}
      />
      <Route path="books" element={<Navigate to="/library" replace />} />
      <Route path="books.html" element={<Navigate to="/library" replace />} />
    </>
  );
}
