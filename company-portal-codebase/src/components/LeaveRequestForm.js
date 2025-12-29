import React, { useState, useEffect } from 'react';
import { submitLeaveRequest } from '../api/googleScriptApi';
import { useLoader } from '../context/LoaderProvider';

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

const LeaveRequestForm = ({ onLeaveSubmitted, setLoadingUser }) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const { loading, setLoading } = useLoader();
    const [formData, setFormData] = useState({
        name: auth?.username || '',
        type: 'Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            name: auth?.username || ''
        }));
    }, [auth?.username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.type || !formData.startDate || !formData.reason) {
            setError('All fields are required.');
            return;
        }

        // Remove endDate validation if endDate is empty
        if (formData.endDate && formData.endDate < formData.startDate) {
            setError('End Date must be after or same as Start Date.');
            return;
        }

        setLoading(true);
        try {
            // Send endDate as empty if not provided (for 1-day leave)
            const leaveData = {
                ...formData,
                endDate: formData.endDate || ''
            };
            await submitLeaveRequest(leaveData);
            setSuccess('Leave request submitted successfully!');
            setFormData({
                name: auth?.username || '',
                type: 'Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });
            if (onLeaveSubmitted) onLeaveSubmitted();
        } catch (err) {
            setError('Failed to submit leave request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12">
                    <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
                        <div className="card-header bg-gradient" style={{
                            background: 'linear-gradient(90deg, #003 60%, #6610f2 100%)',
                            color: '#fff',
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18
                        }}>
                            <div className="d-flex align-items-center justify-content-center">
                                <h4 style={{ color: '#222', fontWeight: 700, letterSpacing: 1 }}>
                            <span role="img" aria-label="form" style={{ fontSize: 32, verticalAlign: 'middle' }}>📝</span>
                            <span className="ms-2">Leave Request Form</span>
                        </h4>
                            </div>
                        </div>
                        <div className="card-body px-4 py-4" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label fw-bold text-info">
                                            <i className="bi bi-person-circle me-1"></i>Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control border-info"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            disabled
                                            style={{ backgroundColor: '#e7f1ff' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="type" className="form-label fw-bold text-primary">
                                            <i className="bi bi-briefcase me-1"></i>Type
                                        </label>
                                        <select
                                            className="form-select border-primary" // Changed from "form-control" to "form-select"
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            style={{ backgroundColor: '#e7f1ff' }}
                                        >
                                            <option value="Leave">Leave</option>
                                            <option value="Work From Home">Work From Home</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="startDate" className="form-label fw-bold text-success">
                                            <i className="bi bi-calendar-event me-1"></i>Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control border-success"
                                            id="startDate"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            style={{ backgroundColor: '#eaffea' }}
                                            // min={getToday()}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="endDate" className="form-label fw-bold text-warning">
                                            <i className="bi bi-calendar-check me-1"></i>End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control border-warning"
                                            id="endDate"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#fffbe7' }}
                                            min={formData.startDate || getToday()}
                                            // endDate is not required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="reason" className="form-label fw-bold text-danger">
                                            <i className="bi bi-chat-left-text me-1"></i>Reason
                                        </label>
                                        <textarea
                                            className="form-control border-danger"
                                            id="reason"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            required
                                            style={{ backgroundColor: '#ffe7e7', minHeight: 80 }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="d-grid mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-gradient py-2"
                                        style={{
                                            background: 'linear-gradient(90deg, #003 60%, #6610f2 100%)',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            borderRadius: 8
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </span>
                                        ) : (
                                            <span>
                                                <i className="bi bi-send me-2"></i>Submit
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequestForm;