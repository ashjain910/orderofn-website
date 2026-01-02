import React, { useEffect, useState } from 'react';
import { fetchNotices, fetchHolidays } from '../api/googleScriptApi';
import PageLoader from './PageLoader'; // <-- Import PageLoader

// Robust date parser for DD/MM/YYYY, DD.MM.YYYY, YYYY-MM-DD
function parseHolidayDate(dateStr) {
  if (!dateStr) return null;
  const slash = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const dot = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const dash = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (slash.test(dateStr)) {
    const [, day, month, year] = dateStr.match(slash);
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  if (dot.test(dateStr)) {
    const [, day, month, year] = dateStr.match(dot);
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  if (dash.test(dateStr)) {
    return new Date(dateStr);
  }
  return new Date(dateStr);
}

const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [noticeRes, holidayRes] = await Promise.all([
        fetchNotices(),
        fetchHolidays()
      ]);
      console.log(noticeRes)
      setNotices(noticeRes || []);
      // Filter holidays for current month
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const holidaysThisMonth = (holidayRes.data || []).filter(h => {
        const d = parseHolidayDate(h.date);
        return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      });
      setHolidays(holidaysThisMonth);
      console.log(holidaysThisMonth)
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="container py-4">
      {loading && <PageLoader />}
      <div className="row justify-content-center" style={loading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        <div className="col-lg-8">
          <div className="panel panel-default shadow rounded-4 border-0">
            <div className="panel-heading d-flex align-items-center px-4 py-3" style={{ background: 'linear-gradient(90deg, #28a745 60%, #20c997 100%)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
              <i className="bi bi-megaphone-fill display-6 me-3 text-warning"></i>
              <h4 className="mb-0 text-white">Notice Board</h4>
            </div>
            <div className="panel-body p-4 bg-white rounded-bottom-4">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                  <h5 className="mb-0">Latest Notices</h5>
                </div>
                {!loading && notices.length === 0 && <div className="text-muted">No notices yet.</div>}
                {notices.map(notice => (
                  <div
                    key={notice.id}
                    className={`alert d-flex align-items-center alert-secondary py-2 mb-2`}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-bold" style={{fontSize:16}}>{notice.title}</div>
                      {notice.description && <div className="text-muted" style={{fontSize:14}}>{notice.description}</div>}
                    </div>
                    <span className="ms-auto text-muted" style={{ fontSize: 12 }}>{notice.date}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="mb-2 d-flex align-items-center">
                <i className="bi bi-calendar-event-fill me-2 text-info"></i>
                <h5 className="mb-0">Holidays This Month</h5>
              </div>
              {!loading && holidays.filter(h => h.admin_status === "Holiday").length === 0 && (
                <div className="alert alert-info mt-2">No holidays for this month.</div>
              )}
              <ul className="list-group list-group-flush">
                {holidays
                  .filter(h => h.admin_status === "Holiday")
                  .filter(h => h.day !== 'Saturday' && h.day !== 'Sunday')
                  .map(h => (
                    <li key={h.sno} className="list-group-item d-flex justify-content-between align-items-center border-0">
                      <span>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <b>{h.holiday}</b> <span className="text-muted">({h.day})</span>
                      </span>
                      <span className="badge bg-light text-dark">{h.date}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNoticeBoard;