import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../api/googleScriptApi';
import PageLoader from '../components/PageLoader';
import { useLoader } from '../context/LoaderProvider'; // ✅ CORRECT

const AdminDashboard = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const { loading, setLoading } = useLoader(); // <-- Use global loader

    const loadLeaveRequests = async () => {
        setLoading(true);
        try {
            const requests = await fetchLeaveRequests();
            setLeaveRequests(requests);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaveRequests();
    }, []);

    return (
        <div className="container-fluid mt-4 px-2 px-md-4">
            {loading && <PageLoader />}
            <div className="row">
                <div className="col-12">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
                        <h2 className="mb-0 text-center flex-grow-1">Leave Requests Overview</h2>
                        <button
                            className="btn btn-outline-primary btn-sm ms-md-3"
                            onClick={loadLeaveRequests}
                            disabled={loading}
                            title="Refresh"
                        >
                            <i className="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.name}</td>
                                        <td>{request.leaveType}</td>
                                        <td>{request.startDate}</td>
                                        <td>{request.endDate}</td>
                                        <td>{request.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;