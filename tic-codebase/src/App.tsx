import React from "react";
import "./App.css";
import {
  Routes,
  Route,
  HashRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
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
import { ToastContainer } from "react-toastify";
import UserProfile from "./pages/user-profile/UserProfile";
import SubscriptionPlans from "./pages/user/SubscriptionPlans";

// const [count, setCount] = useState(0);

function App() {
  // Helper to check login (access token in cookies)
  const isLoggedIn = !!Cookies.get("access");
  return (
    <HashRouter>
      <LogoutListener />
      <ScrollToTop />
      <Routes>
        {/* 👇 DEFAULT ROUTE (Login page will load on app start) */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/jobs" replace /> : <Login />}
        />
        <Route path="/pre-register" element={<PreRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* User routes */}
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

        {/* Admin routes - use AdminHeader as layout */}
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

        {/* Catch-all: redirect to jobs if logged in, else login */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/jobs" : "/"} replace />}
        />
      </Routes>
      <ToastContainer style={{ zIndex: 9999 }} />
    </HashRouter>
  );
}

function LogoutListener() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const logoutHandler = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("tic-logout", logoutHandler);
    return () => {
      window.removeEventListener("tic-logout", logoutHandler);
    };
  }, [navigate]);
  return null;
}

export default App;
