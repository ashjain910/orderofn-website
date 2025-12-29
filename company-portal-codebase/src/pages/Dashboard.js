import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeaveRequests, fetchAllQueries, fetchHolidays, fetchAllExpenses } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

const Dashboard = () => {
  const [leaveCount, setLeaveCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [holidayCount, setHolidayCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [newExpenseCount, setNewExpenseCount] = useState(0);
  const [lastLeave, setLastLeave] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [lastExpense, setLastExpense] = useState(null);
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Leave Requests (this month)
        const leaves = await fetchLeaveRequests();
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const leaveThisMonth = leaves.filter(l => {
          const d = new Date(l.startDate);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });
        setLeaveCount(leaveThisMonth.length);
        setLastLeave(leaveThisMonth.length ? leaveThisMonth[leaveThisMonth.length - 1] : null);

        // Queries (all)
        const queries = await fetchAllQueries();
        setQueryCount(queries.data ? queries.data.length : 0);
        setLastQuery(queries.data && queries.data.length ? queries.data[queries.data.length - 1] : null);

        // Holidays (this month)
        const holidays = await fetchHolidays();
        const holidayThisMonth = holidays.data
          ? holidays.data.filter(h => {
              const d = new Date(h.date);
              return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
          : [];
        setHolidayCount(holidayThisMonth.length);

        // Expenses (this month) and new expenses
        const expenses = await fetchAllExpenses();
        const expenseThisMonth = expenses.data
          ? expenses.data.filter(e => {
              const d = new Date(e.date);
              return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
          : [];
        setExpenseCount(expenseThisMonth.length);
        setNewExpenseCount(
          expenseThisMonth.filter(e => e.status === 'Pending').length
        );
        setLastExpense(expenseThisMonth.length ? expenseThisMonth[expenseThisMonth.length - 1] : null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-primary h-100 shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-calendar2-check display-5 me-3"></i>
                <div>
                  <h5 className="card-title mb-1">Leave Requests</h5>
                  <h3 className="card-text">{leaveCount}</h3>
                  <small>This month</small>
                </div>
              </div>
              {lastLeave && (
                <div className="mt-2">
                  <small>Last: <b>{lastLeave.name}</b> ({lastLeave.type})</small>
                </div>
              )}
              <Link to="/admin" className="btn btn-light btn-sm mt-auto align-self-end">
                View Details
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-success h-100 shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-question-circle display-5 me-3"></i>
                <div>
                  <h5 className="card-title mb-1">Queries</h5>
                  <h3 className="card-text">{queryCount}</h3>
                  <small>Total</small>
                </div>
              </div>
              {lastQuery && (
                <div className="mt-2">
                  <small>Last: <b>{lastQuery.username}</b> - {lastQuery.message}</small>
                </div>
              )}
              <Link to="/admin-queries" className="btn btn-light btn-sm mt-auto align-self-end">
                View Details
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-warning h-100 shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-calendar-event display-5 me-3"></i>
                <div>
                  <h5 className="card-title mb-1">Holidays</h5>
                  <h3 className="card-text">{holidayCount}</h3>
                  <small>This month</small>
                </div>
              </div>
              <Link to="/holidays" className="btn btn-light btn-sm mt-auto align-self-end">
                View Details
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-danger h-100 shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-cash-coin display-5 me-3"></i>
                <div>
                  <h5 className="card-title mb-1">Expenses</h5>
                  <h3 className="card-text">{expenseCount}</h3>
                  <small>This month</small>
                </div>
              </div>
              {lastExpense && (
                <div className="mt-2">
                  <small>Last: <b>{lastExpense.username}</b> - ₹{lastExpense.amount}</small>
                </div>
              )}
              <Link to="/admin-expense" className="btn btn-light btn-sm mt-auto align-self-end">
                View Details
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-info h-100 shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-exclamation-circle display-5 me-3"></i>
                <div>
                  <h5 className="card-title mb-1">New Expenses</h5>
                  <h3 className="card-text">{newExpenseCount}</h3>
                  <small>Pending</small>
                </div>
              </div>
              <Link to="/admin-expense" className="btn btn-light btn-sm mt-auto align-self-end">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;