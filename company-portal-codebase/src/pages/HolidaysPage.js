import React, { useEffect, useState } from 'react';
import { fetchHolidays, updateHolidayStatus } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const statusOptions = ['Holiday', 'Working Day'];

const statusColors = {
  Holiday: 'success',
  'Working Day': 'warning'
};

function isExpired(holidayDate) {
  if (!holidayDate) return false;
  const [day, month, year] = holidayDate.split('.');
  if (!year || !month || !day) return false;
  const hDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  hDate.setHours(0, 0, 0, 0);
  return hDate < today;
}

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const { loading, setLoading } = useLoader();

  // Get auth info from localStorage
  const auth = JSON.parse(localStorage.getItem('auth'));
  const isAdmin = auth && auth.role === 'admin';

  useEffect(() => {
    setLoading(true);
    fetchHolidays()
      .then(data => {
        const holidaysArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setHolidays(holidaysArray);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setLoading]);

  const handleStatusChange = (sno, newStatus) => {
    setLoading(true);
    // const holiday = holidays[idx];
    updateHolidayStatus(sno, newStatus).then(res => {
      setHolidays(prev =>
        prev.map(h =>
          h.sno === sno ? { ...h, admin_status: newStatus } : h
        )
      );
      setSuccessMsg('Status updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
      setLoading(false);
    });
  };

  return (
    <div className="container">
      {loading && <PageLoader />}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header bg-success text-white text-center" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <h3 className="mb-0" style={{fontSize: '24px'}}>
                <i className="bi bi-calendar-heart me-2"></i>
                Holiday List
              </h3>
            </div>
            <div className="card-body" style={{ background: '#f8fafc', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              {successMsg && (
                <div className="alert alert-success py-2">{successMsg}</div>
              )}
              {holidays.length === 0 ? (
                <div className="alert alert-info text-center">No holidays found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle mb-0 mt-0" style={{fontSize: '13px'}}>
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 60 }}>#</th>
                        <th>Holiday Name</th>
                        <th>Date</th>
                        <th>Day</th>
                        {isAdmin && <th>Status</th>}
                        <th>Status Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidays
                        .filter(h => h.day !== 'Saturday' && h.day !== 'Sunday')
                        .map((h, idx) => (
                          <tr key={idx}>
                            <td className="fw-bold text-center">{idx + 1}</td>
                            <td className="text-start">
                              <i className="bi bi-star-fill text-warning me-2"></i>
                              {h.holiday}
                            </td>
                            <td>
                              <span className="badge bg-primary fs-6">{h.date}</span>
                            </td>
                            <td>
                              <span className="badge bg-info text-dark">{h.day}</span>
                            </td>
                            {isAdmin && (
                              <td>
                                <select
                                  className="form-select form-select-sm border-primary"
                                  value={h.admin_status || 'Holiday'}
                                  onChange={e =>
                                    handleStatusChange(h.sno, e.target.value)
                                  }
                                  disabled={loading}
                                  style={{ minWidth: 120 }}
                                >
                                  {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            )}
                            <td>
                              {isExpired(h.date) ? (
                                <span className="badge bg-danger">Expired</span>
                              ) : (
                                <span
                                  className={`badge bg-${statusColors[h.admin_status || 'Holiday']}`}
                                >
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
              <div className="mt-3 text-muted text-center" style={{ fontSize: 15 }}>
                <span className="badge bg-success me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Holiday &nbsp;
                <span className="badge bg-warning text-dark me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Working Day &nbsp;
                <span className="badge bg-danger me-2" style={{ width: 24, height: 24, borderRadius: '50%' }}>&nbsp;</span> Expired
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        .table-hover tbody tr:hover {
          background-color: #e7f1ff !important;
        }
        `}
      </style>
    </div>
  );
};

export default HolidaysPage;