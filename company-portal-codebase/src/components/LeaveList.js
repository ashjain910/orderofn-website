import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../api/googleScriptApi';
import PageLoader from '../components/PageLoader';
import { useLoader } from '../context/LoaderProvider'; // ✅ CORRECT

const LeaveList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [error, setError] = useState(null);
    const { loading, setLoading } = useLoader(); // <-- Use global loader

    const getLeaveRequests = async () => {
        setLoading(true); // Show loader on reload or button click
        try {
            const data = await fetchLeaveRequests();
            setLeaveRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Hide loader after action
        }
    };

    useEffect(() => {
        getLeaveRequests();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container-fluid mt-4 px-2 px-md-4">
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-outline-primary"
                    onClick={getLeaveRequests}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            <h2 className="mb-3 text-center text-md-start">Leave Requests</h2>
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
    );
};

export default LeaveList;