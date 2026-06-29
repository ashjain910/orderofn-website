import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const roleLinks = {
  admin: [
    { to: '/admin',         label: 'Leave Requests', icon: 'bi-calendar2-check' },
    { to: '/admin-stats',   label: 'Statistics',     icon: 'bi-bar-chart-line'  },
    { to: '/admin-queries', label: 'User Queries',   icon: 'bi-chat-left-text'  },
    { to: '/admin-expense', label: 'Expenses',       icon: 'bi-cash-coin'       },
  ],
  user: [
    {
      dropdown: true,
      label: 'Leave',
      icon: 'bi-calendar2-check',
      items: [
        { to: '/',                 label: 'Leave Request', icon: 'bi-send'       },
        { to: '/status',           label: 'My Status',     icon: 'bi-list-check' },
        { to: '/my-leave-summary', label: 'Leave Summary', icon: 'bi-bar-chart'  },
      ],
    },
    { to: '/notice-board',  label: 'Notice Board', icon: 'bi-megaphone'         },
    { to: '/user-query',    label: 'Query',        icon: 'bi-chat-left-dots'    },
    { to: '/user-expense',  label: 'Expense',      icon: 'bi-receipt'           },
    { to: '/user-calendar', label: 'Calendar',     icon: 'bi-calendar3'         },
    { to: '/payslip',       label: 'Payslip',      icon: 'bi-file-earmark-text' },
  ],
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth     = JSON.parse(localStorage.getItem('auth'));

  const handleLogout = () => { localStorage.removeItem('auth'); navigate('/login'); };
  const isActive     = (to) => location.pathname === to;

  const linkStyle = (to) => ({
    color:          isActive(to) ? '#fff'                   : '#c9d3e8',
    fontWeight:     isActive(to) ? 700                      : 500,
    background:     isActive(to) ? 'rgba(255,255,255,0.13)' : 'transparent',
    fontSize:       '0.88rem',
    padding:        '7px 13px',
    borderRadius:   8,
    display:        'flex',
    alignItems:     'center',
    gap:            8,
    textDecoration: 'none',
    transition:     'all 0.2s',
    whiteSpace:     'nowrap',
  });

  const hoverOn  = (e, active) => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; } };
  const hoverOff = (e, active) => { if (!active) { e.currentTarget.style.color = '#c9d3e8'; e.currentTarget.style.background = 'transparent'; } };

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #000033 0%, #00006b 100%)',
      boxShadow:  '0 2px 18px rgba(0,0,51,0.22)',
      position:   'sticky',
      top:         0,
      zIndex:      1000,
    }}>
      <div style={{
        display:     'flex',
        alignItems:  'center',
        minHeight:    62,
        padding:     '0 28px',
      }}>

        {/* ── FAR LEFT: logo only ── */}
        <Link
          to={auth?.role === 'admin' ? '/admin' : '/'}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          <img
            src={require('../images/company-logo-white.png')}
            alt="Company Logo"
            style={{ maxHeight: 40, width: 'auto' }}
          />
        </Link>

        {/* ── SPACER — pushes everything to the right ── */}
        <div style={{ flex: 1 }} />

        {/* ── Mobile toggler ── */}
        <button
          className="navbar-toggler border-0 d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: '#fff', fontSize: '1.3rem', padding: '4px 8px', background: 'none', border: 'none' }}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* ── FAR RIGHT: all nav links + user button ── */}
        <div className="collapse navbar-collapse d-lg-flex" id="mainNavbar"
          style={{ flex: '0 0 auto', flexGrow: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

            {/* Role-based links */}
            {auth && roleLinks[auth.role]?.map((item, idx) =>
              item.dropdown ? (
                <div className="dropdown" key={idx} style={{ listStyle: 'none' }}>
                  <button
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ ...linkStyle(null), border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => hoverOn(e,  false)}
                    onMouseLeave={e => hoverOff(e, false)}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: '0.92rem' }}></i>
                    <span>{item.label}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                    style={{ borderRadius: 12, minWidth: 210, overflow: 'hidden', marginTop: 8, padding: '6px 0' }}>
                    {item.items.map((sub, si) => (
                      <li key={si} style={{ listStyle: 'none' }}>
                        <Link className="dropdown-item" to={sub.to} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          fontSize: '0.88rem', padding: '10px 20px',
                          color:      isActive(sub.to) ? '#000033' : '#374151',
                          fontWeight: isActive(sub.to) ? 700        : 500,
                          background: isActive(sub.to) ? '#eef0ff'  : 'transparent',
                        }}>
                          <i className={`bi ${sub.icon}`} style={{ color: '#000033', fontSize: '0.88rem', width: 16, textAlign: 'center' }}></i>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link key={idx} to={item.to}
                  style={linkStyle(item.to)}
                  onMouseEnter={e => hoverOn(e,  isActive(item.to))}
                  onMouseLeave={e => hoverOff(e, isActive(item.to))}>
                  <i className={`bi ${item.icon}`} style={{ fontSize: '0.92rem' }}></i>
                  <span>{item.label}</span>
                </Link>
              )
            )}

            {/* Holidays */}
            <Link to="/holidays" style={linkStyle('/holidays')}
              onMouseEnter={e => hoverOn(e,  isActive('/holidays'))}
              onMouseLeave={e => hoverOff(e, isActive('/holidays'))}>
              <i className="bi bi-star" style={{ fontSize: '0.92rem' }}></i>
              <span>Holidays</span>
            </Link>

            {/* Admin Notice */}
            {auth?.role === 'admin' && (
              <Link to="/admin/notice" style={linkStyle('/admin/notice')}
                onMouseEnter={e => hoverOn(e,  isActive('/admin/notice'))}
                onMouseLeave={e => hoverOff(e, isActive('/admin/notice'))}>
                <i className="bi bi-megaphone" style={{ fontSize: '0.92rem' }}></i>
                <span>Notice</span>
              </Link>
            )}

            {/* Divider before user button */}
            {auth && (
              <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
            )}

            {/* ── USER BUTTON — red pill, always last on right ── */}
            {auth && (
              <div className="dropdown">
                <button
                  className="dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    background:   '#dc2626',
                    border:        'none',
                    borderRadius:  50,
                    color:         '#fff',
                    fontWeight:    700,
                    fontSize:      '0.88rem',
                    padding:       '7px 16px 7px 8px',
                    display:       'flex',
                    alignItems:    'center',
                    gap:            8,
                    cursor:        'pointer',
                    transition:    'opacity 0.2s',
                    whiteSpace:    'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.87'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.82rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}>
                    {auth.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span>{auth.username}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                  style={{ borderRadius: 12, minWidth: 220, overflow: 'hidden', marginTop: 10, padding: '6px 0' }}>

                  <li style={{ padding: '14px 20px 10px', borderBottom: '1px solid #f1f4f9' }}>
                    <div style={{ fontSize: '0.78rem', color: '#8a9ab5', marginBottom: 3 }}>Signed in as</div>
                    <div style={{ fontWeight: 700, color: '#0d1b3e', fontSize: '0.97rem', marginBottom: 5 }}>{auth.username}</div>
                    <span style={{
                      fontSize: '0.72rem',
                      background: auth.role === 'admin' ? '#000033' : '#16a34a',
                      color: '#fff', borderRadius: 6, padding: '2px 9px', fontWeight: 700,
                    }}>{auth.role}</span>
                  </li>

                  {auth.role === 'admin' && (
                    <>
                      {[
                        { to: '/admin/users',        icon: 'bi-people',        label: 'Manage Users' },
                        { to: '/adminusercreate',    icon: 'bi-person-plus',   label: 'Create User'  },
                        { to: '/admin/payslip-edit', icon: 'bi-pencil-square', label: 'Edit Payslip' },
                      ].map(item => (
                        <li key={item.to} style={{ listStyle: 'none' }}>
                          <Link className="dropdown-item" to={item.to} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontSize: '0.88rem', padding: '11px 20px', color: '#374151',
                          }}>
                            <i className={`bi ${item.icon}`} style={{ color: '#000033', width: 16, textAlign: 'center' }}></i>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </>
                  )}

                  {auth.role === 'user' && (
                    <li style={{ listStyle: 'none' }}>
                      <Link className="dropdown-item" to="/update-password" style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: '0.88rem', padding: '11px 20px', color: '#374151',
                      }}>
                        <i className="bi bi-key" style={{ color: '#000033', width: 16, textAlign: 'center' }}></i>
                        Update Password
                      </Link>
                    </li>
                  )}

                  <li style={{ borderTop: '1px solid #f1f4f9', listStyle: 'none' }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontSize: '0.88rem', padding: '11px 20px', color: '#dc2626',
                      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    }}>
                      <i className="bi bi-box-arrow-right" style={{ width: 16, textAlign: 'center' }}></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
