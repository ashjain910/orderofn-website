import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchUserLeaveRequests } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const STATUS_META = {
  Approved: { cls: 'leave-approved', color: '#16a34a', light: '#f0fff4', icon: 'bi-check-circle-fill' },
  Pending:  { cls: 'leave-pending',  color: '#f59e0b', light: '#fffbeb', icon: 'bi-clock-fill' },
  Rejected: { cls: 'leave-rejected', color: '#dc2626', light: '#fff5f5', icon: 'bi-x-circle-fill' },
  Hold:     { cls: 'leave-hold',     color: '#6c757d', light: '#f1f3f5', icon: 'bi-pause-circle-fill' },
};

const UserCalendarPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, status: '', reason: '', x: 0, y: 0 });
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    if (auth && auth.username) {
      setLoading(true);
      fetchUserLeaveRequests(auth.username)
        .then(data => {
          setLeaves(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, []); // eslint-disable-line

  const leaveMap = {};
  leaves.forEach(leave => {
    const start = new Date(leave.startDate);
    let end = leave.endDate && !isNaN(new Date(leave.endDate)) && leave.endDate !== 'Invalid Date'
      ? new Date(leave.endDate)
      : new Date(leave.startDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      leaveMap[formatDate(d)] = { status: leave.status, reason: leave.reason };
    }
  });

  const counts = { Approved: 0, Pending: 0, Rejected: 0, Hold: 0 };
  leaves.forEach(l => { if (Object.prototype.hasOwnProperty.call(counts, l.status)) counts[l.status]++; });

  function tileClassName({ date, view }) {
    if (view === 'month') {
      const info = leaveMap[formatDate(date)];
      if (info) return STATUS_META[info.status]?.cls || '';
    }
    return null;
  }

  function tileContent({ date, view }) {
    if (view === 'month') {
      const info = leaveMap[formatDate(date)];
      if (info) {
        return (
          <div
            onMouseEnter={e => {
              const tile = e.currentTarget.parentElement;
              const rect = tile ? tile.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
              setTooltip({
                show: true,
                status: info.status,
                reason: info.reason,
                x: rect.left + rect.width / 2,
                y: rect.top
              });
            }}
            onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
            style={{ position: 'absolute', inset: 0, zIndex: 4, background: 'transparent', cursor: 'default' }}
          />
        );
      }
    }
    return null;
  }

  const totalLeaves = leaves.length;

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 col-xl-8">

          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-calendar3-event" style={{ fontSize: '1.1rem' }}></i>
              <h3>My Leave Calendar</h3>
              {totalLeaves > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  {totalLeaves} request{totalLeaves !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="portal-card-body">

              {/* Stats strip */}
              <div className="cal-stats-row">
                {Object.entries(STATUS_META).map(([status, meta]) => (
                  <div key={status} className="cal-stat-pill" style={{ borderColor: meta.color, background: meta.light }}>
                    <i className={`bi ${meta.icon}`} style={{ color: meta.color, fontSize: '0.9rem' }}></i>
                    <span className="cal-stat-label">{status}</span>
                    <span className="cal-stat-count" style={{ color: meta.color }}>{counts[status]}</span>
                  </div>
                ))}
              </div>

              {/* Calendar */}
              <div className="cal-wrapper">
                <Calendar
                  className="cal-custom border-0 w-100"
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                />
              </div>

              {/* Legend */}
              <div className="cal-legend">
                {Object.entries(STATUS_META).map(([status, meta]) => (
                  <div key={status} className="cal-legend-item">
                    <span className="cal-legend-dot" style={{ background: meta.color }}></span>
                    <span>{status}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div className="cal-tooltip" style={{ left: tooltip.x, top: tooltip.y - 58 }}>
          <div className="cal-tooltip-row">
            <span className="cal-tooltip-dot" style={{ background: STATUS_META[tooltip.status]?.color }}></span>
            <strong>{tooltip.status}</strong>
          </div>
          {tooltip.reason && (
            <div className="cal-tooltip-reason">{tooltip.reason}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCalendarPage;
