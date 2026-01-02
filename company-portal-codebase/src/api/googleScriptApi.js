import axios from 'axios';

const BASE_URL = 'https://script.google.com/macros/s/AKfycbx4LpNMAdvEfxlPNtJkBcrHK6i2Mtd6ilv2GWNZx4eoDd1QeaDvekUSHnU0Wks5CIsK/exec';

// OrderofN API URL
// https://script.google.com/macros/s/AKfycbx4LpNMAdvEfxlPNtJkBcrHK6i2Mtd6ilv2GWNZx4eoDd1QeaDvekUSHnU0Wks5CIsK/exec
// Helper function to get auth details from localStorage
export const getAuth = () => {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Invalid auth JSON', err);
    return null;
  }
};

// GET - fetch leave requests
export const fetchLeaveRequests = async () => {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'getLeaveRequests' });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

// GET - submit leave request
export const submitLeaveRequest = async ({ name, type, startDate, endDate, reason }) => {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'submitLeaveRequest',
    name,
    type,
    startDate,
    endDate,
    reason,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

// GET - login user (no authCheck needed)
export const loginUser = async ({ username, password, role }) => {
  const params = new URLSearchParams({ action: 'login', username, password, role });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

// POST - update leave status
export const updateLeaveStatus = async (leave, status) => {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'updateLeaveStatus', ...leave, status });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};


// POST - ReApprove leave status
export const ReapproveStatus = async ({ name, type, startDate, endDate, reason, rowId, id, status }) => {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'reApproveStatus', name, type, startDate, endDate, reason, rowId, id,  status, });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

// GET - fetch user leave requests
export const fetchUserLeaveRequests = async (username) => {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'getUserLeaveRequests', username });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

// Send a user query/feedback (GET)
export async function sendUserQuery(username, message) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'saveUserQuery',
    username,
    message,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Get all queries/feedback (admin) (GET)
export async function fetchAllQueries() {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'getAllQueries',
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Admin reply to a query (GET)
export async function replyToUserQuery(rowId, reply) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'replyToQuery',
    rowId,
    reply,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Submit a new expense
export async function sendUserExpense(username, amount, description, date) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'saveUserExpense',
    username,
    amount,
    description,
    date,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Get all expenses (admin)
export async function fetchAllExpenses() {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'getAllExpenses' });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Get expenses for a user
export async function fetchUserExpenses(username) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({ action: 'getUserExpenses', username });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Admin updates expense
export async function updateExpenseRemark(rowId, status, remark) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateExpenseRemark',
    rowId,
    status,
    remark,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// In googleScriptApi.js
export async function fetchHolidays() {
  // Fetch from your backend or Google Apps Script
  // Example: return fetch('/api/holidays').then(res => res.json());
  // Or call your Google Apps Script endpoint
  const response = await axios.get(`${BASE_URL}?action=getHolidays`);
  return response.data;
}

export async function updateHolidayStatus(sno, status) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateHolidayStatus',
    sno,
    status,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function deleteLeaveRequest(username, startDate, endDate) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'deleteLeaveRequest',
    username,
    startDate,
    endDate,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function createUser(
  username,
  email,
  password,
  full_name,
  emp_code,
  department,
  designation,
  pan_no,
  gender
) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'createUser',
    username,
    email,
    password,
    full_name,
    emp_code,
    department,
    designation,
    pan_no,
    gender,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updateUserPassword(username, oldPassword, newPassword, full_name, emp_code, pan_no) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateUserPassword',
    username,
    oldPassword,
    newPassword,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function fetchNotices() {
  const response = await axios.get(`${BASE_URL}?action=getNotices`);
  return response.data;
}

export async function fetchPayslipPdf(username, financialYear, userKey) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'getPayslipPdf',
    username,
    financialYear,
    userKey,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function getPayslipForUser(username, financialYear) {
  const params = new URLSearchParams({
    action: 'getPayslipForUser',
    username,
    financialYear,
  });
  params.append('authCheck', JSON.stringify(getAuth()));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updatePayslipForUser(data) {
  const params = new URLSearchParams({
    action: 'updatePayslipForUser',
    ...data, // data must include username, financialYear, and all fields below
  });
  params.append('authCheck', JSON.stringify(getAuth()));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function getAllUsers() {
  const params = new URLSearchParams({ action: 'getAllUsers' });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updatePayslipHeader(username, month, year, financialYear) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updatePayslipHeader',
    username,
    month,
    year,
    financialYear,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await fetch(`${BASE_URL}?${params}`);
  return response.json();
}

export async function fetchAllUsers() {
  const params = new URLSearchParams({ action: 'getAllUsers' });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updateUser(username, updates) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateUser',
    username,
    updates: JSON.stringify(updates),
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updateUserAndPayslip(username, updates) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateUserAndPayslip',
    username,
    updates: JSON.stringify(updates),
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function fetchUserDetails(username) {
  const params = new URLSearchParams({
    action: 'getUserDetails',
    username,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function updateUserDetails(username, full_name, emp_code, pan_no) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'updateUserDetails',
    username,
    full_name,
    emp_code,
    pan_no,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Add this to googleScriptApi.js
export async function addNotice(title, description) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'addNotice',
    title,
    description,
    date: new Date().toISOString(),
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function deleteNotice(id) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'deleteNotice',
    id,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

export async function markQueryAsRead(username, date) {
  const auth = getAuth();
  if (!auth || !auth.token || !auth.username) {
    alert('Unauthorized user');
    return { success: false, error: 'Unauthorized' };
  }

  const params = new URLSearchParams({
    action: 'isReadUpdate',
    username,
    date,
  });
  params.append('authCheck', JSON.stringify(auth));
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Send OTP
export async function sendOtp({ email }) {
  const params = new URLSearchParams({
    action: 'sendOtp',
    email,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Verify OTP
export async function verifyOtp({ email, otp }) {
  const params = new URLSearchParams({
    action: 'verifyOtp',
    email,
    otp,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// Update Password
export async function updatePassword({ email, password }) {
  const params = new URLSearchParams({
    action: 'updatePassword',
    email,
    password,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}

// export async function sendUserExpenseWithFile(username, amount, description, date, file) {
//   const auth = getAuth(); // Retrieve auth details from localStorage
//   if (!auth || !auth.token || !auth.username) {
//     alert('Unauthorized user');
//     return { success: false, error: 'Unauthorized' };
//   }

//   const formData = new FormData();
//   formData.append('action', 'saveUserExpenseWithFile');
//   formData.append('username', username);
//   formData.append('amount', amount);
//   formData.append('description', description);
//   formData.append('date', date);
//   formData.append('authCheck', JSON.stringify(auth));
//   formData.append('file', file, file.name); // Attach the file with its name

//   try {
//     const response = await axios.post(BASE_URL, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (err) {
//     console.error('Error uploading file:', err);
//     return { success: false, error: err.message };
//   }
// }


