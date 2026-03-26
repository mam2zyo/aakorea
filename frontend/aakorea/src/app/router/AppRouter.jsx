import { Navigate, Route, Routes } from "react-router-dom";
import UserShell from "../../domains/user/layout/UserShell";
import StoreShell from "../../domains/store/public/layout/StoreShell";
import HeartShell from "../../domains/heart/public/layout/HeartShell";
import AdminPortalShell from "../admin/AdminPortalShell";
import ServiceAdminShell from "../../domains/general/admin/layout/ServiceAdminShell";
import StoreAdminShell from "../../domains/store/admin/layout/StoreAdminShell";
import HeartAdminShell from "../../domains/heart/admin/layout/HeartAdminShell";
import DistrictAdminPage from "../../domains/general/admin/districts/DistrictAdminPage";
import GroupAdminPage from "../../domains/general/admin/groups/GroupAdminPage";
import StoreAdminOverviewPage from "../../domains/store/admin/overview/StoreAdminOverviewPage";
import HeartAdminOverviewPage from "../../domains/heart/admin/overview/HeartAdminOverviewPage";
import PublicRoutes from "./public-routes";
import UserRoutes from "./user-routes";
import StoreRoutes from "./store-routes";
import HeartRoutes from "./heart-routes";
import AdminRoutes from "./admin-routes";
import BasicPublicShell from "../../domains/general/public/layout/BasicPublicShell";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<BasicPublicShell />}>
        {PublicRoutes()}
      </Route>

      <Route path="/me" element={<UserShell />}>
        {UserRoutes()}
      </Route>
      <Route path="/user" element={<Navigate to="/me" replace />} />
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
