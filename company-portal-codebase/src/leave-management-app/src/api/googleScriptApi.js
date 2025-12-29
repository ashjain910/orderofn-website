// filepath: leave-management-app/src/api/googleScriptApi.js
import axios from 'axios';

const API_URL = 'https://your-api-url.com'; // Replace with your actual API URL

export const fetchLeaveRequests = async () => {
  const response = await axios.get(`${API_URL}/leaveRequests`);
  return response.data;
};

export const updateLeaveStatus = async (leave, status) => {
  const response = await axios.put(`${API_URL}/leaveRequests/${leave.id}`, { status });
  return response.data;
};