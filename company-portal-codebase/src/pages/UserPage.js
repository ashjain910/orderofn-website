import React, { useEffect, useState } from 'react';
import LeaveRequestForm from '../components/LeaveRequestForm';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';
import { fetchUserLeaveRequests } from '../api/googleScriptApi';

const UserPage = () => {
  const { loading, setLoading } = useLoader();
  const [leaveCount, setLeaveCount] = useState({ used: 0, total: 12 });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const auth = JSON.parse(localStorage.getItem('auth'));

  useEffect(() => {
    setSummaryLoading(true);
    fetchUserLeaveRequests(auth.username)
      .then(data => {
        const currentYear = new Date().getFullYear();
        let used = 0;
        (Array.isArray(data) ? data : []).forEach(req => {
          if (req.type === 'Leave') {
            const start = new Date(req.startDate);
            const end = req.endDate ? new Date(req.endDate) : new Date(req.startDate);
            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              const day = d.getDay();
              if (d.getFullYear() !== currentYear) continue;
              if (day === 0 || day === 6) continue; // skip weekends
              used += 1;
            }
          }
        });
        setLeaveCount({ used, total: 12 });
        setSummaryLoading(false);
      })
      .catch(() => {
        setLeaveCount({ used: 0, total: 12 });
        setSummaryLoading(false);
      });
  }, [auth.username]);

  const remaining = leaveCount.total - leaveCount.used;

  // Handler to refresh leave count after leave submission
  const refreshLeaveCount = () => {
    setSummaryLoading(true);
    fetchUserLeaveRequests(auth.username)
      .then(data => {
        const currentYear = new Date().getFullYear();
        let used = 0;
        (Array.isArray(data) ? data : []).forEach(req => {
          if (req.type === 'Leave') {
            const start = new Date(req.startDate);
            const end = req.endDate ? new Date(req.endDate) : new Date(req.startDate);
            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              const day = d.getDay();
              if (d.getFullYear() !== currentYear) continue;
              if (day === 0 || day === 6) continue; // skip weekends
              used += 1;
            }
          }
        });
        setLeaveCount({ used, total: 12 });
        setSummaryLoading(false);
      })
      .catch(() => {
        setLeaveCount({ used: 0, total: 12 });
        setSummaryLoading(false);
      });
  };

  return (
    <div className="container-fluid px-2 px-md-4">
      {(loading || summaryLoading) && <PageLoader />}
      <div className="row justify-content-center">
        <div className="col-10 col-lg-8 mb-3">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <i className="bi bi-info-circle-fill text-info me-2"></i>
            <span className="fw-bold text-info">Info:</span>
            <span className="ms-2 text-secondary">
              <div className="mb-1">
                You have used {leaveCount.used} out of your {leaveCount.total} available leave days. Only {remaining} leave days remain. After using all 12 leave days, any additional leave taken will be considered loss of pay.
              </div>
              {/* Submit your leave request using the form below. Track your leave status from the my status. */}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-center mb-2">
            <span className="fw-bold text-dark">Leave Count: {leaveCount.total}/{leaveCount.used} ({remaining} remaining)</span><br />
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <LeaveRequestForm setLoading={setLoading} onLeaveSubmitted={refreshLeaveCount} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;