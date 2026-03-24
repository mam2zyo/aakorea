import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AdminOverviewPage from "./components/admin/AdminOverviewPage";
import MeetingSearchPage from "./pages/MeetingSearchPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import AdminDistrictPage from "./pages/admin/AdminDistrictPage";
import AdminGroupPage from "./pages/admin/AdminGroupPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<MeetingSearchPage />} />
        <Route path="/groups/:groupId" element={<GroupDetailPage />} />
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/districts" element={<AdminDistrictPage />} />
        <Route path="/admin/groups" element={<AdminGroupPage />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AppLayout>
  );
}
