import React, { useEffect, useState } from 'react';
import { fetchHolidays, updateHolidayStatus } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const statusOptions = ['Holiday', 'Working Day'];

function isExpired(holidayDate) {
  if (!holidayDate) return false;
  const [day, month, year] = holidayDate.split('.');
  if (!year || !month || !day) return false;
  const hDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date(); today.setHours(0, 0, 0, 0); hDate.setHours(0, 0, 0, 0);
  return hDate < today;
}

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const { loading, setLoading } = useLoader();
  const auth = JSON.parse(localStorage.getItem('auth'));
  const isAdmin = auth && auth.role === 'admin';

  useEffect(() => {
    setLoading(true);
    fetchHolidays()
      .then(data => {
        setHolidays(Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setLoading]);

  const handleStatusChange = (sno, newStatus) => {
    setLoading(true);
    updateHolidayStatus(sno, newStatus).then(() => {
      setHolidays(prev => prev.map(h => h.sno === sno ? { ...h, admin_status: newStatus } : h));
      setSuccessMsg('Status updated!');
      setTimeout(() => setSuccessMsg(''), 2000);
      setLoading(false);
    });
  };

  const visible = holidays.filter(h => h.day !== 'Saturday' && h.day !== 'Sunday');

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-calendar-heart" style={{ fontSize: '1.2rem' }}></i>
              <h5>Holiday List — {new Date().getFullYear()}</h5>
            </div>
            <div className="portal-card-body">
              {successMsg && <div className="portal-alert-success">{successMsg}</div>}

              {visible.length === 0 ? (
                <div className="portal-empty"><i className="bi bi-calendar-x" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>No holidays found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th style={{ width: 48 }}>#</th>
                        <th>Holiday</th>
                        <th>Date</th>
                        <th>Day</th>
                        {isAdmin && <th>Update</th>}
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((h, idx) => (
                        <tr key={idx}>
                          <td className="text-center fw-bold" style={{ color: '#8a9ab5' }}>{idx + 1}</td>
                          <td>
                            <i className="bi bi-star-fill text-warning me-2" style={{ fontSize: '0.75rem' }}></i>
                            <span className="fw-semibold">{h.holiday}</span>
                          </td>
                          <td>
                            <span className="badge" style={{ background: '#eef0ff', color: '#000033', fontWeight: 600, fontSize: '0.82rem', padding: '5px 10px', borderRadius: 6 }}>{h.date}</span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark" style={{ fontWeight: 600 }}>{h.day}</span>
                          </td>
                          {isAdmin && (
                            <td>
                              <select className="portal-select" style={{ height: 36, fontSize: '0.82rem' }} value={h.admin_status || 'Holiday'} onChange={e => handleStatusChange(h.sno, e.target.value)} disabled={loading}>
                                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </td>
                          )}
                          <td>
                            {isExpired(h.date) ? (
                              <span className="badge bg-danger">Expired</span>
                            ) : (
                              <span className={`badge bg-${h.admin_status === 'Working Day' ? 'warning text-dark' : 'success'}`}>
                                {h.admin_status || 'Holiday'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="d-flex align-items-center gap-3 mt-3" style={{ fontSize: '0.83rem', color: '#8a9ab5' }}>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#198754', marginRight: 5 }}></span>Holiday</span>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#ffc107', marginRight: 5 }}></span>Working Day</span>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#dc3545', marginRight: 5 }}></span>Expired</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaysPage;
