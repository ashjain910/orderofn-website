import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const roleLinks = {
  admin: [
    // { to: '/admin-dashboard', label: 'Dashboard' },         // Admin dashboard summary
    { to: '/admin', label: 'Leave Requests' },              // Admin leave requests page
    { to: '/admin-stats', label: 'Statistics' },
    { to: '/admin-queries', label: 'User Queries' },
    { to: '/admin-expense', label: 'View Expenses' },
  ],
  user: [
    // { to: '/dashboard', label: 'Dashboard' },    
    {
      dropdown: true,
      label: (
        <>
          <i className="bi bi-calendar2-check me-1"></i>
          Leave
        </>
      ),
      items: [
        { to: '/', label: 'Leave Request' },
        { to: '/status', label: 'My Status' },
        { to: '/my-leave-summary', label: 'Leave Summary' },
      ],
    },
    { to: '/notice-board', label: 'Notice Board' },
    { to: '/user-query', label: 'Query / Feedback' },
    { to: '/user-expense', label: 'Submit Expense' },
    { to: '/user-calendar', label: 'My Calendar' },
    { to: '/payslip', label: 'Payslip' }
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('auth'));

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#000033' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/">
            <img
                src={require('../images/company-logo-white.png')}
                alt="Company Logo"
                style={{ maxHeight: 50, maxWidth: '100%' }}
              />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              {auth &&
                roleLinks[auth.role]?.map((item, idx) =>
                  item.dropdown ? (
                    <li className="nav-item dropdown" key={idx}>
                      <button
                        className="btn btn-outline-light dropdown-toggle"
                        type="button"
                        id={`dropdown${idx}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {item.label}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown${idx}`}>
                        {item.items.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link className="dropdown-item" to={sub.to}>
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item" key={idx}>
                      <Link className="nav-link text-white" to={item.to}>
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              <li className="nav-item">
                <Link className="nav-link text-white" to="/holidays">
                  Holidays
                </Link>
              </li>
              {auth && auth.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/notice">
                    <i className="bi bi-megaphone me-2"></i>
                    Notice
                  </Link>
                </li>
              )}
              {/* {auth && auth.role === 'user' && (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/update-password">
                    Update Password
                  </Link>
                </li>
              )} */}
              {auth && (
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle ms-lg-2"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {auth.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    {auth.role === 'admin' && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/admin/users">
                            <i className="bi bi-people me-2"></i>
                            Manage Users
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/adminusercreate">
                            <i className="bi bi-person-plus me-2"></i>
                            Create User
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/payslip-edit">
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Payslip
                          </Link>
                        </li>
                      </>
                    )}
                    {auth.role === 'user' && (
                      <li>
                        <Link className="dropdown-item" to="/update-password">
                          <i className="bi bi-key me-2"></i>
                          Update Password
                        </Link>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Navbar;
