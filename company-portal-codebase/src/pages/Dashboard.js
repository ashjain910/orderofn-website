import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeaveRequests, fetchAllQueries, fetchHolidays, fetchAllExpenses } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import PageLoader from './PageLoader';

const StatCard = ({ icon, iconClass, label, value, sub, to, linkLabel }) => (
  <div className={`portal-stat-card ${iconClass}`} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 22 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, width: '100%' }}>
      <div className={`portal-stat-icon ${iconClass}`}><i className={`bi ${icon}`}></i></div>
      <div>
        <div className="portal-stat-label">{label}</div>
        <div className="portal-stat-value">{value}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: '#8a9ab5', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    {to && (
      <Link to={to} className="portal-btn portal-btn-sm w-100" style={{ justifyContent: 'center', textDecoration: 'none', display: 'flex' }}>
        {linkLabel || 'View Details'}
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const [leaveCount, setLeaveCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [holidayCount, setHolidayCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [newExpenseCount, setNewExpenseCount] = useState(0);
  const [lastLeave, setLastLeave] = useState(null);
  const [lastExpense, setLastExpense] = useState(null);
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaves, queries, holidays, expenses] = await Promise.all([
          fetchLeaveRequests(), fetchAllQueries(), fetchHolidays(), fetchAllExpenses()
        ]);
        const thisMonth = new Date().getMonth(), thisYear = new Date().getFullYear();

        const leaveThisMonth = leaves.filter(l => { const d = new Date(l.startDate); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
        setLeaveCount(leaveThisMonth.length);
        setLastLeave(leaveThisMonth.length ? leaveThisMonth[leaveThisMonth.length - 1] : null);

        setQueryCount(queries.data ? queries.data.length : 0);

        const holidayThisMonth = (holidays.data || []).filter(h => { const d = new Date(h.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
        setHolidayCount(holidayThisMonth.length);

        const expThisMonth = (expenses.data || []).filter(e => { const d = new Date(e.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
        setExpenseCount(expThisMonth.length);
        setNewExpenseCount(expThisMonth.filter(e => e.status === 'Pending').length);
        setLastExpense(expThisMonth.length ? expThisMonth[expThisMonth.length - 1] : null);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []); // eslint-disable-line

  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="portal-page">
      {loading && <PageLoader />}
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>Admin Dashboard</h4>
            <p style={{ color: '#8a9ab5', fontSize: '0.9rem', margin: '4px 0 0' }}>{monthName} overview</p>
          </div>
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-4">
              <StatCard icon="bi-calendar2-check" iconClass="total" label="Leave Requests" value={leaveCount} sub={lastLeave ? `Last: ${lastLeave.name} (${lastLeave.type})` : `${monthName} total`} to="/admin" linkLabel="View Requests" />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <StatCard icon="bi-question-circle" iconClass="remaining" label="Queries" value={queryCount} sub="Total queries" to="/admin-queries" linkLabel="View Queries" />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <StatCard icon="bi-calendar-event" iconClass="wfh" label="Holidays" value={holidayCount} sub={`${monthName} holidays`} to="/holidays" linkLabel="View Holidays" />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <StatCard icon="bi-cash-coin" iconClass="used" label="Expenses" value={expenseCount} sub={lastExpense ? `Last: ${lastExpense.username} — ₹${lastExpense.amount}` : `${monthName} total`} to="/admin-expense" linkLabel="View Expenses" />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <StatCard icon="bi-exclamation-circle" iconClass="total" label="Pending Expenses" value={newExpenseCount} sub="Awaiting approval" to="/admin-expense" linkLabel="Review Now" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
