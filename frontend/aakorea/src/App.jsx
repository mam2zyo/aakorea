import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import MeetingSearchPage from "./pages/MeetingSearchPage";
import GroupDetailPage from "./pages/GroupDetailPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<MeetingSearchPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </AppLayout>
  );
}
