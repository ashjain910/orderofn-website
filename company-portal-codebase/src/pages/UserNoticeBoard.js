import React, { useEffect, useState } from 'react';
import { fetchNotices, fetchHolidays } from '../api/googleScriptApi';
import PageLoader from './PageLoader';

function parseHolidayDate(dateStr) {
  if (!dateStr) return null;
  const slash = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const dot   = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const dash  = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (slash.test(dateStr)) { const [, d, m, y] = dateStr.match(slash); return new Date(+y, +m - 1, +d); }
  if (dot.test(dateStr))   { const [, d, m, y] = dateStr.match(dot);   return new Date(+y, +m - 1, +d); }
  if (dash.test(dateStr))  return new Date(dateStr);
  return new Date(dateStr);
}

const UserNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [noticeRes, holidayRes] = await Promise.all([fetchNotices(), fetchHolidays()]);
      setNotices(noticeRes || []);
      const now = new Date();
      const thisMonth = now.getMonth(), thisYear = now.getFullYear();
      setHolidays((holidayRes.data || []).filter(h => {
        const d = parseHolidayDate(h.date);
        return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth;
      }));
      setLoading(false);
    }
    loadData();
  }, []);

  const activeHolidays = holidays.filter(h => h.admin_status === 'Holiday' && h.day !== 'Saturday' && h.day !== 'Sunday');

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-8">
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-megaphone-fill" style={{ fontSize: '1.2rem' }}></i>
              <h5>Notice Board</h5>
            </div>
            <div className="portal-card-body">

              {/* Notices section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
                  <div style={{ width: 4, height: 20, background: '#000033', borderRadius: 2 }}></div>
                  <h6 className="mb-0 fw-bold" style={{ color: '#0d1b3e' }}>Latest Notices</h6>
                </div>
                {!loading && notices.length === 0 && (
                  <div className="portal-empty" style={{ padding: '20px 0' }}>No notices yet.</div>
                )}
                {notices.map(notice => (
                  <div key={notice.id} style={{ background: '#f8faff', border: '1px solid #e5e9f0', borderRadius: 10, padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <i className="bi bi-megaphone" style={{ color: '#000033', fontSize: '1rem', marginTop: 2, flexShrink: 0 }}></i>
                    <div style={{ flex: 1 }}>
                      <div className="fw-semibold" style={{ fontSize: '0.95rem', color: '#0d1b3e' }}>{notice.title}</div>
                      {notice.description && <div style={{ fontSize: '0.85rem', color: '#8a9ab5', marginTop: 2 }}>{notice.description}</div>}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#8a9ab5', whiteSpace: 'nowrap', flexShrink: 0 }}>{notice.date}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e5e9f0', marginBottom: 20 }}></div>

              {/* Holidays section */}
              <div>
                <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
                  <div style={{ width: 4, height: 20, background: '#38a169', borderRadius: 2 }}></div>
                  <h6 className="mb-0 fw-bold" style={{ color: '#0d1b3e' }}>Holidays This Month</h6>
                </div>
                {!loading && activeHolidays.length === 0 ? (
                  <div className="portal-info-banner">
                    <i className="bi bi-calendar-x" style={{ flexShrink: 0 }}></i>
                    <span>No holidays this month.</span>
                  </div>
                ) : (
                  <div>
                    {activeHolidays.map(h => (
                      <div key={h.sno} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px', borderBottom: '1px solid #f1f4f9' }}>
                        <span>
                          <i className="bi bi-star-fill text-warning me-2" style={{ fontSize: '0.75rem' }}></i>
                          <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{h.holiday}</span>
                          <span style={{ color: '#8a9ab5', fontSize: '0.82rem', marginLeft: 6 }}>({h.day})</span>
                        </span>
                        <span className="badge" style={{ background: '#eef0ff', color: '#000033', fontWeight: 600, fontSize: '0.8rem', padding: '5px 10px', borderRadius: 6 }}>{h.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNoticeBoard;
