// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import Jobs from "./pages/jobs/Jobs";
import JobDetail from "./pages/jobs/JobDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Settings from "./pages/settings/Settings";
import ManageJobAlert from "./pages/settings/manage-job-alert/ManageJobAlert";
import PreRegister from "./pages/auth/pre-registration/PreRegister";
import Header from "./pages/common/header/Header";
import ScrollToTop from "./pages/common/ScrollToTop";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 👇 DEFAULT ROUTE (Login page will load on app start) */}
        <Route path="/" element={<Login />} />
        <Route path="/pre-register" element={<PreRegister />} />
        {/* All other routes wrapped with Header */}
        <Route
          element={
            <>
              <Header />
            </>
          }
        >
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail jobsData={[]} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/manage-job-alert" element={<ManageJobAlert />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
