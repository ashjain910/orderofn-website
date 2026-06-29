import React, { useEffect, useState } from 'react';
import LeaveRequestForm from '../components/LeaveRequestForm';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';
import { fetchUserLeaveRequests } from '../api/googleScriptApi';

const UserPage = () => {
  const { loading, setLoading } = useLoader();
  const [leaveCount, setLeaveCount] = useState({ used: 0, total: 18 });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const auth = JSON.parse(localStorage.getItem('auth'));

  const calcUsed = (data) => {
    const currentYear = new Date().getFullYear();
    let used = 0;
    (Array.isArray(data) ? data : []).forEach(req => {
      if (req.type === 'Leave') {
        const start = new Date(req.startDate);
        const end = req.endDate ? new Date(req.endDate) : new Date(req.startDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (d.getFullYear() !== currentYear) continue;
          if (d.getDay() === 0 || d.getDay() === 6) continue;
          used += 1;
        }
      }
    });
    return used;
  };

  const loadData = (setSummary = true) => {
    if (setSummary) setSummaryLoading(true);
    fetchUserLeaveRequests(auth.username)
      .then(data => { setLeaveCount({ used: calcUsed(data), total: 18 }); setSummaryLoading(false); })
      .catch(() => { setLeaveCount({ used: 0, total: 18 }); setSummaryLoading(false); });
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line

  const remaining = leaveCount.total - leaveCount.used;

  return (
    <div className="portal-page">
      {(loading || summaryLoading) && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-9 col-xl-8">

          {/* Stat cards */}
          {/* <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4">
              <div className="portal-stat-card used">
                <div className="portal-stat-icon used"><i className="bi bi-calendar-x"></i></div>
                <div>
                  <div className="portal-stat-label">Used</div>
                  <div className="portal-stat-value">{summaryLoading ? '—' : leaveCount.used}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="portal-stat-card remaining">
                <div className="portal-stat-icon remaining"><i className="bi bi-calendar-check"></i></div>
                <div>
                  <div className="portal-stat-label">Remaining</div>
                  <div className="portal-stat-value">{summaryLoading ? '—' : remaining}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="portal-stat-card total">
                <div className="portal-stat-icon total"><i className="bi bi-calendar2"></i></div>
                <div>
                  <div className="portal-stat-label">Total</div>
                  <div className="portal-stat-value">{leaveCount.total}</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Warning banner */}
          {!summaryLoading && remaining <= 5 && (
            <div className="portal-info-banner mb-4">
              <i className="bi bi-info-circle-fill" style={{ fontSize: '1.1rem', marginTop: 1, flexShrink: 0 }}></i>
              <span>
                You have used <strong>{leaveCount.used}</strong> of your <strong>{leaveCount.total}</strong> leave days.{' '}
                {remaining === 0
                  ? 'You have no leave days left — any additional leave will be treated as loss of pay.'
                  : `Only ${remaining} day${remaining === 1 ? '' : 's'} remaining.`}
              </span>
            </div>
          )}

          {/* Leave request form */}
          <LeaveRequestForm setLoading={setLoading} onLeaveSubmitted={() => loadData(false)} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
