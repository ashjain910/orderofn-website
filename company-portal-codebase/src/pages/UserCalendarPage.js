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

const statusColors = {
  Approved: 'bg-success text-white',
  Pending: 'bg-warning text-dark',
  Rejected: 'bg-danger text-white',
  Hold: 'bg-secondary text-white'
};

const UserCalendarPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [hoverInfo, setHoverInfo] = useState({ status: '', reason: '', show: false, x: 0, y: 0 });
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
    // eslint-disable-next-line
  }, []);

  // Map leave dates to status and reason
  const leaveMap = {};
  leaves.forEach(leave => {
    const start = new Date(leave.startDate);
    // If endDate is missing, empty, or invalid, use startDate
    let end = leave.endDate && !isNaN(new Date(leave.endDate)) && leave.endDate !== 'Invalid Date'
      ? new Date(leave.endDate)
      : new Date(leave.startDate);

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const key = formatDate(d);
      leaveMap[key] = { status: leave.status, reason: leave.reason };
    }
  });

  // Highlight leave days
  function tileClassName({ date, view }) {
    if (view === 'month') {
      const dateStr = formatDate(date);
      if (leaveMap[dateStr]) {
        return statusColors[leaveMap[dateStr].status] + ' calendar-status-circle';
      }
    }
    return null;
  }

  // Show tooltip with leave status and reason on hover
  function tileContent({ date, view }) {
    if (view === 'month') {
      const dateStr = formatDate(date);
      if (leaveMap[dateStr]) {
        return (
          <div
            onMouseEnter={e => {
              const rect = e.target.getBoundingClientRect();
              setHoverInfo({
                status: leaveMap[dateStr].status,
                reason: leaveMap[dateStr].reason,
                show: true,
                x: rect.left + rect.width / 2,
                y: rect.top
              });
            }}
            onMouseLeave={() => setHoverInfo({ status: '', reason: '', show: false, x: 0, y: 0 })}
            style={{ width: '100%', height: '100%' }}
          />
        );
      }
    }
    return null;
  }

  return (
    <div className="container py-4">
      {loading && <PageLoader />}
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header bg-primary text-white text-center" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <h3 className="mb-0">
                <i className="bi bi-calendar3-event me-2"></i>My Leave Calendar
              </h3>
            </div>
            <div className="card-body" style={{ background: '#f8fafc', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              <div className="d-flex justify-content-center mb-3">
                <Calendar
                  className="w-100 border-0 calendar-custom"
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                />
                {hoverInfo.show && (
                  <div
                    style={{
                      position: 'fixed',
                      left: hoverInfo.x,
                      top: hoverInfo.y - 40,
                      background: '#222',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: 6,
                      zIndex: 9999,
                      pointerEvents: 'none',
                      fontSize: 15,
                      maxWidth: 320,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    <div><b>Status:</b> {hoverInfo.status}</div>
                    <div><b>Reason:</b> {hoverInfo.reason}</div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="badge bg-success me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Approved &nbsp;
                <span className="badge bg-warning text-dark me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Pending &nbsp;
                <span className="badge bg-danger me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Rejected &nbsp;
                <span className="badge bg-secondary me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Hold
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Custom calendar day highlight */}
      <style>
        {`
        .calendar-custom .react-calendar__tile {
          border-radius: 50% !important;
          transition: background 0.2s;
        }
        .calendar-status-circle {
          width: 2.2em !important;
          height: 2.2em !important;
          margin: auto;
          font-size: 1em;
          border-radius: 50% !important;
        }
        .react-calendar__tile--now {
          box-shadow: 0 0 0 2px #6610f2;
        }
        `}
      </style>
    </div>
  );
};

export default UserCalendarPage;