import React, { useEffect, useState } from 'react';
import { fetchAllQueries, replyToUserQuery } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import { formatDate } from '../pipes/formatDatePipe'; // Import the pipe

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [reply, setReply] = useState({});
  const [success, setSuccess] = useState('');
  const [reload, setReload] = useState(0);
  const [userFilter, setUserFilter] = useState('');
  const [activeTab, setActiveTab] = useState('unread'); // Track active tab
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);
    fetchAllQueries().then(data => {
      let queriesArray = [];
      if (Array.isArray(data)) {
        queriesArray = data;
      } else if (Array.isArray(data?.queries)) {
        queriesArray = data.queries;
      } else if (Array.isArray(data?.data)) {
        queriesArray = data.data;
      }
      setQueries(queriesArray);
      setLoading(false);
    });
  }, [reload, setLoading]);

  const handleReply = async (id) => {
    if (!reply[id] || !reply[id].trim()) return;
    setLoading(true);
    await replyToUserQuery(id, reply[id]);
    setSuccess('Reply sent!');
    setReply({ ...reply, [id]: '' });
    setReload(r => r + 1);
    setTimeout(() => setSuccess(''), 2000);
    setLoading(false);
  };

  // Get unique usernames for filter dropdown
  const userList = Array.from(new Set(queries.map(q => q.username))).sort();

  // Filter and sort queries based on active tab, user filter, and date
  const filteredQueries = queries
    .filter(q => {
      const matchesTab = activeTab === 'read' ? !!q.adminReply : !q.adminReply; // Use adminReply instead of isRead
      const matchesUser = !userFilter || q.username === userFilter;
      return matchesTab && matchesUser;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      <div className="card shadow">
        <div className="card-header text-dark d-flex justify-content-between align-items-center">
          <h4 className="mb-0" style={{fontSize: '24px'}}>User Queries & Feedback</h4>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${activeTab === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'read' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('read')}
            >
              Read
            </button>
          </div>
        </div>
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {/* User filter dropdown */}
          <div className="mb-3 d-flex align-items-center flex-wrap">
            <label className="me-2 fw-bold" htmlFor="userFilter">
              <i className="bi bi-funnel me-1"></i>Filter by User:
            </label>
            <select
              id="userFilter"
              className="form-select form-select-sm"
              style={{ maxWidth: 220, minWidth: 120 }}
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
            >
              <option value="">All Users</option>
              {userList.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle" style={{fontSize: '13px'}}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Message</th>
                  <th>Admin Reply</th>
                  <th>Reply</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(filteredQueries) && filteredQueries.length > 0) ? (
                  filteredQueries.map(q => (
                    <tr key={q.id}>
                      <td>{formatDate(q.date)}</td>
                      <td>{q.username}</td>
                      <td style={{ minWidth: 180, wordBreak: 'break-word' }}>{q.message}</td>
                      <td style={{ minWidth: 150, wordBreak: 'break-word' }}>
                        {q.adminReply || <span className="text-muted">No reply</span>}
                      </td>
                      <td style={{ minWidth: 200 }}>
                        <textarea
                          className="form-control mb-1"
                          rows={2}
                          value={reply[q.id] || ''}
                          onChange={e => setReply({ ...reply, [q.id]: e.target.value })}
                          disabled={!!q.adminReply || loading}
                        />
                        <button
                          className="btn btn-sm btn-success mt-1 w-100"
                          onClick={() => handleReply(q.id)}
                          disabled={!!q.adminReply || !reply[q.id] || loading}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No {activeTab === 'read' ? 'read' : 'unread'} queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQueriesPage;