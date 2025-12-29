import React, { useEffect, useState } from 'react';
import { fetchUserLeaveRequests, deleteLeaveRequest, submitLeaveRequest, ReapproveStatus } from '../api/googleScriptApi';
import PageLoader from '../pages/PageLoader';
import { useLoader } from '../context/LoaderProvider'; // ✅ CORRECT
import { formatDateWithDay } from '../pipes/formatDatePipe'; // Import the date formatting pipe

// Add this utility function or import from your utils if available
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper to get YYYY-MM-DD in local time
function toLocalDateString(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);
  return d.toISOString().slice(0, 10);
}

function getToday() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

const statusColors = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
  Hold: 'secondary'
};

const UserStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [editLeave, setEditLeave] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editType, setEditType] = useState('');
  const [editRowId, setEditRowId] = useState(null); // <-- Track leave rowId/id
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader(); // <-- Use loader context

  const loadLeaves = () => {
    setLoading(true);
    setError('');
    if (auth && auth.username) {
      fetchUserLeaveRequests(auth.username)
        .then(data => {
          if (Array.isArray(data)) {
            const sortedLeaves = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by startDate descending
            setLeaves(sortedLeaves);
          } else {
            setLeaves([]);
            // Only show alert if there is a true error, not for successful fetch
            if (data?.error || data?.success === false) {
              alert(data?.message || 'No leave data found or server error.');
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          setLeaves([]);
          setError(error?.message || 'Failed to fetch leave data.');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (editLeave) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [editLeave]);

  // When editLeave changes, initialize the local state
  useEffect(() => {
    if (editLeave) {
      setEditStartDate(editLeave.startDate);
      setEditEndDate(editLeave.endDate);
      setEditReason(editLeave.reason);
      setEditType(editLeave.type);
      setEditRowId(editLeave.rowId || editLeave.id || null); // Support both rowId and id
    }
  }, [editLeave]);

  const handleEdit = (leave) => {
    setEditLeave(leave);
  };

  return (
    <div className="container-fluid mt-1 px-2 px-md-4">
      {loading && <PageLoader />}
      <div className="card shadow" style={{ background: 'linear-gradient(135deg, #eaffea 60%, #fffbe7 100%)' }}>
        <div className="card-header bg-success text-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <h2 className="mb-0 text-center text-md-start flex-grow-1" style={{fontSize: '24px'}}>My Requests Status</h2>
          <button
            className="btn btn-outline-light btn-sm ms-md-3"
            onClick={loadLeaves}
            disabled={loading}
            title="Refresh"
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : leaves.length === 0 ? (
            <div className="alert alert-info">No leave requests found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mt-0" style={{ fontSize: '13px' }}>
                <thead className="table-primary">
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Action</th> {/* Add this */}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, idx) => (
                    <tr key={idx}>
                      <td style={{ minWidth: 120 }}>{formatDateWithDay(leave.startDate)}</td>
                      <td style={{ minWidth: 120 }}>
                        {leave.startDate === leave.endDate || !leave.endDate ? '---------' : formatDateWithDay(leave.endDate)}
                      </td>
                      <td
                        style={{
                          maxWidth: 220,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: leave.reason.length > 100 ? 'pointer' : 'default'
                        }}
                        onMouseEnter={e => {
                          document.querySelectorAll('.custom-leave-tooltip').forEach(el => el.remove());
                          if (leave.reason.length > 100) {
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
                          }
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
                      </td>
                      <td>
                        <span className={`badge bg-${statusColors[leave.status] || 'secondary'}`}>{leave.status}</span>
                      </td>
                      <td>{leave.type || 'N/A'}</td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to withdraw this leave request?')) {
                                  setLoading(true);
                                  const res = await deleteLeaveRequest(auth.username, leave.startDate, leave.endDate);
                                  if (res.success) {
                                    loadLeaves();
                                  } else {
                                    alert('Failed to withdraw leave.');
                                  }
                                }
                              }}
                            >
                              Withdraw
                            </button>
                          </>
                        ) : leave.status === 'Approved' ? (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(leave)}
                          >
                            Edit
                          </button>
                        ) : 'No action available'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {editLeave && (
        <>
          <div
            className="modal fade show"
            style={{
              display: 'block',
              position: 'fixed',
              zIndex: 1050,
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'auto'
            }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">Edit Leave Request</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setEditLeave(null)}></button>
                </div>
                <div className="modal-body">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setLoading(true); // Show loader on button click
                      // await deleteLeaveRequest(auth.username, editLeave.startDate, editLeave.endDate);
                      // Pass rowId/id to submitLeaveRequest if available
                      const res = await ReapproveStatus({
                        name: auth.username,
                        type: editType,
                        startDate: editStartDate,
                        endDate: editEndDate,
                        reason: editReason,
                        rowId: editRowId || undefined,
                        id: editRowId || undefined,
                        status: 'Reapprove'
                      });
                      // If the leave was previously approved, set status to 'Reapprove'
                      // if (editLeave.status === 'Approved' && res.success) {
                      //   await import('../api/googleScriptApi').then(api =>
                      //     api.updateLeaveStatus({
                      //       name: auth.username,
                      //       type: editType,
                      //       startDate: editStartDate,
                      //       endDate: editEndDate,
                      //       reason: editReason,
                      //       rowId: editRowId || undefined,
                      //       id: editRowId || undefined
                      //     }, 'Reapprove')
                      //   );
                      // }
                      setLoading(false); // Hide loader after action
                      if (res.success) {
                        setEditLeave(null);
                        loadLeaves();
                      } else {
                        alert('Failed to update leave.');
                      }
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="form-control"
                        value={toLocalDateString(editStartDate)}
                        // min={getToday()}
                        onChange={e => setEditStartDate(e.target.value)}
                        required
                      />
                      <div className="form-text">
                        Previous: {formatDate(editLeave.startDate)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="form-control"
                        value={toLocalDateString(editEndDate)}
                        // min={editStartDate ? toLocalDateString(editStartDate) : getToday()}
                        onChange={e => setEditEndDate(e.target.value)}
                        
                      />
                      <div className="form-text">
                        Previous: {formatDate(editLeave.endDate)}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type of Leave</label>
                      <select
                        name="type"
                        className="form-control"
                        value={editType}
                        onChange={e => setEditType(e.target.value)}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Leave">Leave</option>
                        <option value="Work From Home">Work From Home</option>
                        {/* Add more types if needed */}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <textarea
                        name="reason"
                        className="form-control"
                        value={editReason}
                        onChange={e => setEditReason(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success me-2" disabled={loading}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditLeave(null)} disabled={loading}>Cancel</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Modal backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: 'fixed',
              zIndex: 1040,
              left: 0,
              top: 0,
              width: '100vw',
              height: '100vh',
              background: '#000',
              opacity: 0.5
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default UserStatusPage;