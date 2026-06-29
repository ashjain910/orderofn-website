import React, { useState, useEffect } from 'react';
import { submitLeaveRequest } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

const getToday = () => new Date().toISOString().split('T')[0];

const LeaveRequestForm = ({ onLeaveSubmitted }) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const { loading, setLoading } = useLoader();
  const [formData, setFormData] = useState({ name: auth?.username || '', type: 'Leave', startDate: '', endDate: '', reason: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { setFormData(prev => ({ ...prev, name: auth?.username || '' })); }, [auth?.username]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.name || !formData.type || !formData.startDate || !formData.reason) { setError('All fields are required.'); return; }
    if (formData.endDate && formData.endDate < formData.startDate) { setError('End date must be after start date.'); return; }
    setLoading(true);
    try {
      await submitLeaveRequest({ ...formData, endDate: formData.endDate || '' });
      setSuccess('Leave request submitted successfully!');
      setFormData({ name: auth?.username || '', type: 'Leave', startDate: '', endDate: '', reason: '' });
      if (onLeaveSubmitted) onLeaveSubmitted();
    } catch {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-card">
      <div className="portal-card-header">
        <i className="bi bi-send" style={{ fontSize: '1.1rem' }}></i>
        <h5>Leave Request Form</h5>
      </div>
      <div className="portal-card-body">
        {error && <div className="portal-alert-error">{error}</div>}
        {success && <div className="portal-alert-success">{success}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="portal-label"><i className="bi bi-person-circle me-1"></i>Name</label>
              <input type="text" className="portal-input" name="name" value={formData.name} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="col-md-6">
              <label className="portal-label"><i className="bi bi-briefcase me-1"></i>Type</label>
              <select className="portal-select" name="type" value={formData.type} onChange={handleChange} required>
                <option value="Leave">Leave — Full Day</option>
                <option value="Half Day AM">Leave — Half Day AM</option>
                <option value="Half Day PM">Leave — Half Day PM</option>
                <option value="Work From Home">Work From Home</option>
                <option value="WFH - Half Day AM">WFH — Half Day AM</option>
                <option value="WFH - Half Day PM">WFH — Half Day PM</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="portal-label"><i className="bi bi-calendar-event me-1"></i>Start Date</label>
              <input type="date" className="portal-input" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="portal-label"><i className="bi bi-calendar-check me-1"></i>End Date <span style={{ color: '#8a9ab5', fontWeight: 400 }}>(optional)</span></label>
              <input type="date" className="portal-input" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate || getToday()} />
            </div>
            <div className="col-12">
              <label className="portal-label"><i className="bi bi-chat-left-text me-1"></i>Reason</label>
              <textarea className="portal-textarea" name="reason" value={formData.reason} onChange={handleChange} required placeholder="Enter reason for leave..." style={{ minHeight: 90 }}></textarea>
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="portal-btn w-100" disabled={loading} style={{ justifyContent: 'center', height: 48, fontSize: '0.95rem' }}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm"></span> Submitting…</>
              ) : (
                <><i className="bi bi-send"></i> Submit Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
