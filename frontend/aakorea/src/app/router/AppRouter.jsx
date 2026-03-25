import { Navigate, Route, Routes } from "react-router-dom";
import MemberShell from "../shells/MemberShell";
import StoreShell from "../shells/StoreShell";
import HeartShell from "../shells/HeartShell";
import AdminPortalShell from "../admin/AdminPortalShell";
import ServiceAdminShell from "../../domains/service/layout/ServiceAdminShell";
import StoreAdminShell from "../../domains/store/layout/StoreAdminShell";
import HeartAdminShell from "../../domains/heart/layout/HeartAdminShell";
import DistrictAdminPage from "../../domains/service/districts/DistrictAdminPage";
import GroupAdminPage from "../../domains/service/groups/GroupAdminPage";
import StoreAdminOverviewPage from "../../domains/store/admin/StoreAdminOverviewPage";
import HeartAdminOverviewPage from "../../domains/heart/admin/HeartAdminOverviewPage";
import PublicRoutes from "./public-routes";
import MemberRoutes from "./member-routes";
import StoreRoutes from "./store-routes";
import HeartRoutes from "./heart-routes";
import AdminRoutes from "./admin-routes";
import BasicPublicShell from "../../domains/basic/layout/BasicPublicShell";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<BasicPublicShell />}>
        {PublicRoutes()}
      </Route>

      <Route path="/me" element={<MemberShell />}>
        {MemberRoutes()}
      </Route>
      <Route path="/member" element={<Navigate to="/me" replace />} />

      <Route path="/store" element={<StoreShell />}>
        {StoreRoutes()}
      </Route>

      <Route path="/heart" element={<HeartShell />}>
        {HeartRoutes()}
      </Route>

      <Route path="/admin" element={<AdminPortalShell />}>
        {AdminRoutes()}

        <Route path="service" element={<ServiceAdminShell />}>
          <Route index element={<Navigate to="groups" replace />} />
          <Route path="districts" element={<DistrictAdminPage />} />
          <Route path="groups" element={<GroupAdminPage />} />
        </Route>

        <Route path="store" element={<StoreAdminShell />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<StoreAdminOverviewPage />} />
        </Route>

        <Route path="heart" element={<HeartAdminShell />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<HeartAdminOverviewPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
