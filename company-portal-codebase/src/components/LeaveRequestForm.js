import React, { useState, useEffect } from 'react';
import { submitLeaveRequest, fetchUserLeaveRequests } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

const getToday = () => new Date().toISOString().split('T')[0];

const calcUsedDays = (data) => {
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

const countWeekdays = (start, end) => {
  if (!start) return 0;
  const s = new Date(start);
  const e = end ? new Date(end) : new Date(start);
  let count = 0;
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) count++;
  }
  return count;
};

const LEAVE_TYPES = [
  { value: 'Leave',            label: 'Full Day',  group: 'leave', icon: 'bi-sun' },
  { value: 'Half Day AM',      label: 'Half AM',   group: 'leave', icon: 'bi-brightness-high' },
  { value: 'Half Day PM',      label: 'Half PM',   group: 'leave', icon: 'bi-moon' },
  { value: 'Work From Home',   label: 'WFH Full',  group: 'wfh',   icon: 'bi-house' },
  { value: 'WFH - Half Day AM',label: 'WFH AM',    group: 'wfh',   icon: 'bi-house-up' },
  { value: 'WFH - Half Day PM',label: 'WFH PM',    group: 'wfh',   icon: 'bi-house-down' },
];

const LeaveRequestForm = ({ onLeaveSubmitted }) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();
  const [formData, setFormData] = useState({
    name: auth?.username || '', type: 'Leave', startDate: '', endDate: '', reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ used: 0, total: 18, loading: true });

  const loadStats = () => {
    if (!auth?.username) return;
    fetchUserLeaveRequests(auth.username)
      .then(data => setStats({ used: calcUsedDays(data), total: 18, loading: false }))
      .catch(() => setStats({ used: 0, total: 18, loading: false }));
  };

  useEffect(() => { loadStats(); }, []); // eslint-disable-line
  useEffect(() => {
    setFormData(prev => ({ ...prev, name: auth?.username || '' }));
  }, [auth?.username]); // eslint-disable-line

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.name || !formData.type || !formData.startDate || !formData.reason) {
      setError('All fields are required.'); return;
    }
    if (formData.endDate && formData.endDate < formData.startDate) {
      setError('End date must be after start date.'); return;
    }
    setLoading(true);
    try {
      await submitLeaveRequest({ ...formData, endDate: formData.endDate || '' });
      setSuccess('Leave request submitted successfully!');
      setFormData({ name: auth?.username || '', type: 'Leave', startDate: '', endDate: '', reason: '' });
      loadStats();
      if (onLeaveSubmitted) onLeaveSubmitted();
    } catch {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const remaining = stats.total - stats.used;
  const usedPct = Math.min(100, (stats.used / stats.total) * 100);
  const barColor = remaining === 0 ? '#e53e3e' : remaining <= 5 ? '#d97706' : '#38a169';
  const isLeaveType = ['Leave', 'Half Day AM', 'Half Day PM'].includes(formData.type);
  const duration = countWeekdays(formData.startDate, formData.endDate);
  const wouldExceed = isLeaveType && !stats.loading && (stats.used + duration) > stats.total;
  const initials = (auth?.username || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const currentYear = new Date().getFullYear();

  return (
    <div className="portal-card">

      {/* Header */}
      <div className="portal-card-header" style={{ padding: '18px 24px', gap: 14, alignItems: 'center' }}>
        {/* <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(255,255,255,0.13)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.15rem', flexShrink: 0
        }}>
          <i className="bi bi-send-fill"></i>
        </div> */}
        <div>
          <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Leave Request</h5>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: 400 }}>
            Submit leave or WFH for approval
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px',
            background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)',
            padding: '3px 10px', borderRadius: 20
          }}>{currentYear}</span>
        </div>
      </div>

      <div className="portal-card-body" style={{ padding: 0 }}>

        {/* ── Stats Strip ── */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #edf0f7',
          background: 'linear-gradient(135deg, #fafbfd 0%, #f4f6fb 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: '#8a9ab5',
              textTransform: 'uppercase', letterSpacing: '0.6px'
            }}>Annual Leave Balance</span>
            {!stats.loading && remaining <= 5 && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 700,
                color: remaining === 0 ? '#dc2626' : '#d97706',
                background: remaining === 0 ? '#fff5f5' : '#fffbeb',
                border: `1px solid ${remaining === 0 ? '#fca5a5' : '#fde68a'}`,
                padding: '2px 9px', borderRadius: 20
              }}>
                <i className={`bi ${remaining === 0 ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'}`} style={{ marginRight: 4 }}></i>
                {remaining === 0 ? 'No days left' : `Only ${remaining} left`}
              </span>
            )}
          </div>

          {/* Stat numbers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12 }}>
            {[
              { label: 'Used',      value: stats.used,      color: '#e53e3e', bg: '#fff5f5', icon: 'bi-calendar-x' },
              { label: 'Remaining', value: remaining,        color: barColor,  bg: '#f0fff4', icon: 'bi-calendar-check' },
              { label: 'Total',     value: stats.total,     color: '#0d1b3e', bg: '#eef0ff', icon: 'bi-calendar2' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ width: 1, height: 40, background: '#e5e9f0', flexShrink: 0, margin: '0 18px' }}></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: s.bg, color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', flexShrink: 0
                  }}>
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                      {stats.loading ? '—' : s.value}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#8a9ab5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Progress bar section */}
            <div style={{ flex: 1, paddingLeft: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: '0.7rem', color: '#8a9ab5' }}>Usage</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: barColor }}>{stats.loading ? '' : `${Math.round(usedPct)}%`}</span>
              </div>
              <div style={{ height: 7, borderRadius: 6, background: '#e5e9f0', overflow: 'hidden' }}>
                {!stats.loading && (
                  <div style={{
                    height: '100%', width: `${usedPct}%`,
                    background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                    borderRadius: 6, transition: 'width 0.6s ease'
                  }} />
                )}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#b0bcd4', marginTop: 4 }}>
                {stats.loading ? '' : `${stats.used} of ${stats.total} days used`}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form Body ── */}
        <div style={{ padding: '22px 24px' }}>

          {/* Alerts */}
          {error && (
            <div className="portal-alert-error" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <i className="bi bi-exclamation-circle-fill" style={{ flexShrink: 0, fontSize: '0.95rem' }}></i>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="portal-alert-success" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
              <i className="bi bi-check-circle-fill" style={{ flexShrink: 0, fontSize: '0.95rem' }}></i>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Employee row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#f7f9fc', border: '1.5px solid #e0e6ed',
              borderRadius: 10, padding: '10px 16px', marginBottom: 20
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#000033', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.88rem', flexShrink: 0, letterSpacing: '0.5px'
              }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0d1b3e', lineHeight: 1.2 }}>
                  {auth?.username || ''}
                </div>
                <div style={{ fontSize: '0.73rem', color: '#8a9ab5', marginTop: 3 }}>Leave applicant</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px',
                  background: '#eef0ff', color: '#000033',
                  padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase'
                }}>Employee</span>
              </div>
            </div>

            {/* Leave type quick-picks */}
            <div style={{ marginBottom: 20 }}>
              <label className="portal-label" style={{ marginBottom: 10 }}>
                <i className="bi bi-briefcase"></i>Leave Type
              </label>

              {/* Leave row */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8a9ab5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                  <i className="bi bi-calendar3" style={{ marginRight: 4 }}></i>Leave
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LEAVE_TYPES.filter(t => t.group === 'leave').map(t => {
                    const active = formData.type === t.value;
                    return (
                      <button key={t.value} type="button"
                        onClick={() => setFormData(f => ({ ...f, type: t.value }))}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '7px 14px', borderRadius: 8,
                          border: `1.5px solid ${active ? '#e53e3e' : '#e0e6ed'}`,
                          background: active ? '#fff0f0' : '#fff',
                          color: active ? '#e53e3e' : '#5a6a82',
                          fontWeight: active ? 700 : 500,
                          fontSize: '0.82rem', cursor: 'pointer',
                          transition: 'all 0.15s',
                          boxShadow: active ? '0 0 0 3px #e53e3e18' : 'none'
                        }}>
                        <i className={`bi ${t.icon}`} style={{ fontSize: '0.8rem' }}></i>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WFH row */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8a9ab5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                  <i className="bi bi-house" style={{ marginRight: 4 }}></i>Work From Home
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LEAVE_TYPES.filter(t => t.group === 'wfh').map(t => {
                    const active = formData.type === t.value;
                    return (
                      <button key={t.value} type="button"
                        onClick={() => setFormData(f => ({ ...f, type: t.value }))}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '7px 14px', borderRadius: 8,
                          border: `1.5px solid ${active ? '#d97706' : '#e0e6ed'}`,
                          background: active ? '#fffbeb' : '#fff',
                          color: active ? '#d97706' : '#5a6a82',
                          fontWeight: active ? 700 : 500,
                          fontSize: '0.82rem', cursor: 'pointer',
                          transition: 'all 0.15s',
                          boxShadow: active ? '0 0 0 3px #d9770618' : 'none'
                        }}>
                        <i className={`bi ${t.icon}`} style={{ fontSize: '0.8rem' }}></i>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="portal-label"><i className="bi bi-calendar-event"></i>Start Date</label>
                <input type="date" className="portal-input" name="startDate"
                  value={formData.startDate} onChange={handleChange} required
                  style={{ height: 46 }} />
              </div>
              <div className="col-md-6">
                <label className="portal-label">
                  <i className="bi bi-calendar-check"></i>End Date
                  <span style={{ color: '#b0bcd4', fontWeight: 400, marginLeft: 4 }}>(optional)</span>
                </label>
                <input type="date" className="portal-input" name="endDate"
                  value={formData.endDate} onChange={handleChange}
                  min={formData.startDate || getToday()}
                  style={{ height: 46 }} />
              </div>

              {/* Duration badge */}
              {formData.startDate && (
                <div className="col-12" style={{ marginTop: 0 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: wouldExceed ? '#fff5f5' : '#eef4ff',
                      border: `1px solid ${wouldExceed ? '#fca5a5' : '#c7d9f8'}`,
                      borderRadius: 20, padding: '4px 13px',
                      fontSize: '0.78rem', color: wouldExceed ? '#dc2626' : '#2d4a8a', fontWeight: 600
                    }}>
                      <i className={`bi ${wouldExceed ? 'bi-exclamation-circle' : 'bi-clock'}`} style={{ fontSize: '0.75rem' }}></i>
                      {duration === 1 ? '1 working day' : `${duration} working days`}
                    </span>
                    {wouldExceed && (
                      <span style={{
                        fontSize: '0.75rem', color: '#dc2626', fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: 4
                      }}>
                        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '0.72rem' }}></i>
                        Exceeds your leave balance
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="col-12">
                <label className="portal-label"><i className="bi bi-chat-left-text"></i>Reason</label>
                <textarea className="portal-textarea" name="reason"
                  value={formData.reason} onChange={handleChange} required
                  placeholder="Enter reason for leave or WFH…"
                  style={{ minHeight: 96 }}></textarea>
                {formData.reason.length > 0 && (
                  <div style={{ textAlign: 'right', fontSize: '0.71rem', color: '#b0bcd4', marginTop: 3 }}>
                    {formData.reason.length} chars
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div style={{ marginTop: 22 }}>
              <button type="submit" className="portal-btn w-100" disabled={loading}
                style={{
                  justifyContent: 'center', height: 50,
                  fontSize: '0.95rem', borderRadius: 10,
                  background: isLeaveType
                    ? 'linear-gradient(135deg, #000033 0%, #00005a 100%)'
                    : 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: isLeaveType
                    ? '0 4px 14px rgba(0,0,51,0.25)'
                    : '0 4px 14px rgba(217,119,6,0.25)',
                  border: 'none', letterSpacing: '0.01em'
                }}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm"></span>&nbsp;&nbsp;Submitting…</>
                ) : (
                  <>
                    <i className={`bi ${isLeaveType ? 'bi-send-fill' : 'bi-house-fill'}`}></i>
                    {isLeaveType ? 'Submit Leave Request' : 'Submit WFH Request'}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
