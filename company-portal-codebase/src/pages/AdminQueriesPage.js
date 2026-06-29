import React, { useEffect, useState } from 'react';
import { fetchAllQueries, replyToUserQuery } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';
import { formatDate } from '../pipes/formatDatePipe';

const AdminQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [reply, setReply] = useState({});
  const [success, setSuccess] = useState('');
  const [reload, setReload] = useState(0);
  const [userFilter, setUserFilter] = useState('');
  const [activeTab, setActiveTab] = useState('unread');
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);
    fetchAllQueries().then(data => {
      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.queries)) arr = data.queries;
      else if (Array.isArray(data?.data)) arr = data.data;
      setQueries(arr);
      setLoading(false);
    });
  }, [reload, setLoading]);

  const handleReply = async (id) => {
    if (!reply[id]?.trim()) return;
    setLoading(true);
    await replyToUserQuery(id, reply[id]);
    setSuccess('Reply sent!');
    setReply({ ...reply, [id]: '' });
    setReload(r => r + 1);
    setTimeout(() => setSuccess(''), 2500);
    setLoading(false);
  };

  const userList = Array.from(new Set(queries.map(q => q.username))).sort();
  const unread = queries.filter(q => !q.adminReply).length;
  const read   = queries.filter(q =>  q.adminReply).length;

  const filtered = queries
    .filter(q => {
      const tabMatch  = activeTab === 'read' ? !!q.adminReply : !q.adminReply;
      const userMatch = !userFilter || q.username === userFilter;
      return tabMatch && userMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-xl-11">

          <div className="d-flex justify-content-between align-items-center mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h4 style={{ fontWeight: 700, color: '#0d1b3e', margin: 0 }}>User Queries & Feedback</h4>
              <p style={{ color: '#8a9ab5', fontSize: '0.88rem', margin: '2px 0 0' }}>{filtered.length} queries shown</p>
            </div>
            {/* Tab buttons */}
            <div style={{ display: 'flex' }}>
              <button className={`portal-tab ${activeTab === 'unread' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('unread')}>
                <i className="bi bi-hourglass-split me-1"></i>Pending
                <span className="ms-2 badge" style={{ background: activeTab === 'unread' ? 'rgba(255,255,255,0.25)' : '#c7d9f8', color: activeTab === 'unread' ? '#fff' : '#000033', borderRadius: 20, padding: '2px 8px', fontSize: '0.75rem' }}>{unread}</span>
              </button>
              <button className={`portal-tab ${activeTab === 'read' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('read')}>
                <i className="bi bi-check2-circle me-1"></i>Replied
                <span className="ms-2 badge" style={{ background: activeTab === 'read' ? 'rgba(255,255,255,0.25)' : '#c7d9f8', color: activeTab === 'read' ? '#fff' : '#000033', borderRadius: 20, padding: '2px 8px', fontSize: '0.75rem' }}>{read}</span>
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="portal-card mb-3">
            <div className="portal-card-body" style={{ padding: '14px 20px' }}>
              <div className="d-flex align-items-end gap-3">
                <div>
                  <label className="portal-label" style={{ marginBottom: 4 }}>Filter by User</label>
                  <select className="portal-select" style={{ width: 200, height: 38, fontSize: '0.85rem' }} value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                    <option value="">All Users</option>
                    {userList.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="portal-card">
            <div className="portal-card-header">
              <i className="bi bi-chat-left-text" style={{ fontSize: '1.1rem' }}></i>
              <h5>Queries — {activeTab === 'unread' ? 'Pending' : 'Replied'}</h5>
            </div>
            <div className="portal-card-body" style={{ padding: 0 }}>
              {success && <div className="portal-alert-success" style={{ margin: '16px 20px 0' }}>{success}</div>}
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th style={{ width: 100 }}>Date</th>
                      <th style={{ width: 120 }}>User</th>
                      <th>Message</th>
                      <th style={{ width: '25%' }}>Admin Reply</th>
                      {activeTab === 'unread' && <th style={{ width: '25%' }}>Reply</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="portal-empty">No {activeTab === 'read' ? 'replied' : 'pending'} queries.</td></tr>
                    ) : filtered.map(q => (
                      <tr key={q.id}>
                        <td style={{ fontSize: '0.82rem', color: '#8a9ab5', whiteSpace: 'nowrap' }}>{formatDate(q.date)}</td>
                        <td style={{ fontWeight: 600, color: '#0d1b3e' }}>{q.username}</td>
                        <td style={{ wordBreak: 'break-word', fontSize: '0.88rem' }}>{q.message}</td>
                        <td style={{ wordBreak: 'break-word' }}>
                          {q.adminReply
                            ? <span style={{ color: '#16a34a', fontSize: '0.88rem' }}>{q.adminReply}</span>
                            : <span style={{ color: '#8a9ab5', fontSize: '0.85rem' }}>No reply yet</span>}
                        </td>
                        {activeTab === 'unread' && (
                          <td>
                            <textarea
                              className="portal-textarea"
                              rows={2}
                              style={{ minHeight: 60, fontSize: '0.85rem', marginBottom: 6 }}
                              value={reply[q.id] || ''}
                              onChange={e => setReply({ ...reply, [q.id]: e.target.value })}
                              disabled={!!q.adminReply || loading}
                              placeholder="Type reply…"
                            />
                            <button
                              className="portal-btn portal-btn-sm portal-btn-success w-100"
                              style={{ justifyContent: 'center' }}
                              onClick={() => handleReply(q.id)}
                              disabled={!!q.adminReply || !reply[q.id] || loading}
                            >
                              <i className="bi bi-send"></i> Reply
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminQueriesPage;
