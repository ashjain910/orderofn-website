import PublicJobs from "./pages/public/PublicJobs";
import PublicJobDetail from "./pages/public/PublicJobDetail";

import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  Routes,
  Route,
  HashRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/auth/login/Login";
import Jobs from "./pages/jobs/Jobs";
import JobDetail from "./pages/jobs/JobDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/settings/Settings";
import ManageJobAlert from "./pages/settings/manage-job-alert/ManageJobAlert";
import PreRegister from "./pages/auth/pre-registration/PreRegister";
import Header from "./pages/common/header/Header";
import ScrollToTop from "./pages/common/ScrollToTop";
import PrivateRoute from "./components/common/PrivateRoute";
import PrivateAdminRoute from "./components/common/adminRouteAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHeader from "./pages/admin/AdminHeader";
import AdminJobs from "./pages/admin/AdminJobs";
import MyTeachers from "./pages/admin/MyTeachers";
import AdminJobDetail from "./pages/admin/AdminJobDetail";
import PostJob from "./pages/admin/post-jobs";
import UserProfile from "./pages/user-profile/UserProfile";
import SubscriptionPlans from "./pages/user/SubscriptionPlans";
import ForgotPassword from "./pages/auth/login/ForgotPassword";
import ResetPassword from "./pages/auth/login/ResetPassword";
// const [count, setCount] = useState(0);

function App() {
  // Helper to check login (access token in cookies)
  return (
    <HashRouter>
      <LogoutListener />
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* <Route path="/jobs" element={<Jobs />} /> */}
        {/* <Route path="/jobs/:id" element={<JobDetail />} /> */}
        {/* Public Jobs Listing and Details */}
        <Route path="/public-jobs" element={<PublicJobs />} />
        <Route path="/public-jobs/:id" element={<PublicJobDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* User Protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<Header />}>
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-job-alert" element={<ManageJobAlert />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          </Route>
        </Route>
        {/* Admin Protected */}
        <Route element={<PrivateAdminRoute />}>
          <Route element={<AdminHeader />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/teachers" element={<MyTeachers />} />
            <Route path="/admin/job-details/:id" element={<AdminJobDetail />} />
            <Route path="/admin/post-job" element={<PostJob />} />
            <Route path="/admin/post-job/:id" element={<PostJob />} />
          </Route>
        </Route>
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

function LogoutListener() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const logoutHandler = () => {
      navigate("/", { replace: true }); // ✅ FIXED
    };

    window.addEventListener("tic-logout", logoutHandler);
    return () => {
      window.removeEventListener("tic-logout", logoutHandler);
    };
  }, [navigate]);

  return null;
}

export default App;
