import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserStatusPage from './pages/UserStatusPage';
import AdminStatsPage from './pages/AdminStatsPage';
import UserQueryPage from './pages/UserQueryPage';
import AdminQueriesPage from './pages/AdminQueriesPage';
import UserExpensePage from './pages/UserExpensePage';
import AdminExpensePage from './pages/AdminExpensePage';
import UserCalendarPage from './pages/UserCalendarPage';
import HolidaysPage from './pages/HolidaysPage';
import AdminCreateUser from './pages/AdminCreateUser';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import { useLoader } from './context/LoaderProvider';
import PageLoader from './pages/PageLoader';
import AdminDashboard from './pages/Dashboard';
import UserNoticeBoard from './pages/UserNoticeBoard';
import PayslipPage from './pages/PayslipPage';
import AdminPayslipEditPage from './pages/AdminPayslipEditPage';
import AdminUserListPage from './pages/AdminUserListPage';
import UnderMaintenancePage from './pages/UnderMaintenancePage';
import Notice from './pages/Notice'; // Import the Notice component
import MyLeaveSummary from './pages/MyLeaveSummary'; // Import MyLeaveSummary component


export default function App() {
  const location = useLocation();
  const { loading } = useLoader();


const auth = JSON.parse(localStorage.getItem('auth'));
const isUser = auth && auth.role === 'user';

// // Allow access to login page even if user is logged in
// if (isUser && location.pathname !== '/login') {
//   // Optionally, clear navigation/menu here
//   return <UnderMaintenancePage />;
// }

  return (
    <>
      {loading && <PageLoader />}
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/holidays" element={<HolidaysPage />} />

        {/* Protected pages */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute role="user">
              <UpdatePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute role="user">
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute role="user">
              <UserStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-query"
          element={
            <ProtectedRoute role="user">
              <UserQueryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-expense"
          element={
            <ProtectedRoute role="user">
              <UserExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-calendar"
          element={
            <ProtectedRoute role="user">
              <UserCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute role="user">
              <UpdatePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notice-board"
          element={
            <ProtectedRoute role="user">
              <UserNoticeBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payslip"
          element={
            <ProtectedRoute role="user">
              <PayslipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-leave-summary"
          element={
            <ProtectedRoute role="user">
              <MyLeaveSummary />
            </ProtectedRoute>
          }
        />

        {/* Protected routes for admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminusercreate"
          element={
            <ProtectedRoute role="admin">
              <AdminCreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-stats"
          element={
            <ProtectedRoute role="admin">
              <AdminStatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-queries"
          element={
            <ProtectedRoute role="admin">
              <AdminQueriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-expense"
          element={
            <ProtectedRoute role="admin">
              <AdminExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payslip-edit"
          element={
            <ProtectedRoute role="admin">
              <AdminPayslipEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notice"
          element={
            <ProtectedRoute role="admin">
              <Notice />
            </ProtectedRoute>
          }
        />

        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}