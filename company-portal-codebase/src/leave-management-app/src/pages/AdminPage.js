import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests, updateLeaveStatus } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider';
import formatDateWithDay from '../pipes/formatDatePipe';

const statusColors = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
  Hold: 'secondary'
};

const AdminPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [success, setSuccess] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const { loading, setLoading } = useLoader();

  const loadLeaves = () => {
    setLoading(true);
    fetchLeaveRequests()
      .then(data => {
        const sortedLeaves = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setLeaves(sortedLeaves);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleStatusChange = async (leave, status) => {
    const leaveKey = `${leave.name}-${leave.startDate}-${leave.endDate}-${leave.reason}`;
    setLoadingId(leaveKey);
    setLoading(true);
    const result = await updateLeaveStatus(leave, status);
    if (result.success) {
      setSuccess(`Leave status updated to "${status}" successfully!`);
      loadLeaves();
      setTimeout(() => setSuccess(''), 2000);
    }
    setLoadingId(null);
    setLoading(false);
  };

  return (
    <div className="container-fluid mt-4 px-2 px-md-4">
      {loading && <PageLoader />}
      <div className="card shadow" style={{ background: 'linear-gradient(135deg, #fffbe7 60%, #e7f1ff 100%)' }}>
        <div className="card-header bg-warning text-dark d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <h2 className="mb-0 text-center text-md-start flex-grow-1">Leave Requests</h2>
          <button
            className="btn btn-outline-dark btn-sm ms-md-3"
            onClick={loadLeaves}
            disabled={loading}
            title="Refresh"
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-primary">
                <tr>
                  <th style={{ minWidth: 120 }}>Name</th>
                  <th style={{ minWidth: 120 }}>Start</th>
                  <th style={{ minWidth: 120 }}>End</th>
                  <th style={{ minWidth: 180 }}>Reason</th>
                  <th style={{ minWidth: 100 }}>Status</th>
                  <th style={{ minWidth: 120 }}>Type</th>
                  <th style={{ minWidth: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, idx) => {
                  const leaveKey = `${leave.name}-${leave.startDate}-${leave.endDate}-${leave.reason}`;
                  return (
                    <tr key={idx}>
                      <td style={{ minWidth: 120 }}>{leave.name}</td>
                      <td style={{ minWidth: 120 }}>{formatDate(leave.startDate)}</td>
                      <td style={{ minWidth: 120 }}>{formatDate(leave.endDate)}</td>
                      <td
                        style={{
                          minWidth: 200,
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                      >
                        <span
                          style={{ display: 'inline-block', width: '100%' }}
                          onMouseEnter={e => {
                            const tooltip = document.createElement('div');
                            tooltip.innerText = leave.reason;
                            tooltip.style.position = 'fixed';
                            tooltip.style.background = '#333';
                            tooltip.style.color = '#fff';
                            tooltip.style.padding = '8px 12px';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.zIndex = 9999;
                            tooltip.style.maxWidth = '400px';
                            tooltip.style.fontSize = '0.95rem';
                            tooltip.className = 'custom-leave-tooltip';
                            document.body.appendChild(tooltip);
                            const tooltipHeight = tooltip.offsetHeight || 40;
                            tooltip.style.left = (e.clientX + 10) + 'px';
                            tooltip.style.top = (e.clientY - tooltipHeight - 10) + 'px';
                            e.target._tooltip = tooltip;
                          }}
                          onMouseLeave={e => {
                            if (e.target._tooltip) {
                              document.body.removeChild(e.target._tooltip);
                              e.target._tooltip = null;
                            }
                          }}
                        >
                          {leave.reason.length > 100
                            ? leave.reason.slice(0, 100) + '...'
                            : leave.reason}
                        </span>
                      </td>
                      <td style={{ minWidth: 100 }}>
                        <span className={`badge bg-${statusColors[leave.status] || 'secondary'}`}>{leave.status}</span>
                      </td>
                      <td style={{ minWidth: 120 }}>{leave.type}</td>
                      <td style={{ minWidth: 180 }} className="d-flex flex-column flex-md-row gap-1">
                        <button
                          className="btn btn-success btn-sm mb-1 mb-md-0 me-md-2"
                          onClick={() => handleStatusChange(leave, 'Approved')}
                          disabled={leave.status === 'Approved' || loadingId === leaveKey}
                        >
                          {loadingId === leaveKey ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Approve'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm mb-1 mb-md-0 me-md-2"
                          onClick={() => handleStatusChange(leave, 'Rejected')}
                          disabled={leave.status === 'Rejected' || loadingId === leaveKey}
                        >
                          {loadingId === leaveKey ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Reject'}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(leave, 'Hold')}
                          disabled={leave.status === 'Hold' || loadingId === leaveKey}
                        >
                          {loadingId === leaveKey ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Hold'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;