import "./admin-css.css";
export default function AdminDashboard() {
  return (
    <>
      <div
        className="admin-dashboard-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            padding: 32,
            minWidth: 320,
            textAlign: "center",
          }}
        >
          <img
            src="/tic/tic_logo.png"
            alt="Admin Logo"
            style={{ width: 80, marginBottom: 16 }}
          />
          <h2 className="mb-3">Admin Dashboard</h2>
          <p className="text-muted mb-4">
            Welcome, Admin! Here you can manage users, jobs, and view analytics.
          </p>
          {/* Add dashboard widgets, stats, and navigation here */}
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-outline-primary mx-2">
              Manage Users
            </button>
            <button className="btn btn-outline-success mx-2">
              Manage Jobs
            </button>
            <button className="btn btn-outline-info mx-2">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
