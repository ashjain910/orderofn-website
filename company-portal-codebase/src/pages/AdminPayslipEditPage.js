import React, { useState, useEffect } from 'react';
import { getAllUsers, getPayslipForUser, updatePayslipForUser } from '../api/googleScriptApi';

const initialState = {
  username: '',
  name: '',
  employeeCode: '',
  designation: '',
  department: '',
  employeeGroup: '',
  doj: '',
  panNo: '',
  gender: '',
  payPeriod: '',
  location: '',
  basic: '',
  specialAllowance: '',
  tds: '',
  advance: '',
  bank: '',
  bankAccountNo: '',
  uan: '',
  houseRentAllowance: '',
  lop: '', // was uan
};

const AdminPayslipEditPage = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Financial year logic (same as PayslipPage.js)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const fyStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;
  const fyEndYear = fyStartYear + 1;
  const prevFyStartYear = fyStartYear - 1;
  const prevFyEndYear = fyStartYear;
  const fyString = (start, end) => `${String(start).slice(-2)}-${String(end).slice(-2)}`;
  const financialYears = [
    { label: `April ${prevFyStartYear} - March ${prevFyEndYear}`, value: fyString(prevFyStartYear, prevFyEndYear) },
    { label: `April ${fyStartYear} - March ${fyEndYear}`, value: fyString(fyStartYear, fyEndYear) }
  ];
  const [selectedFY, setSelectedFY] = useState(financialYears[1].value);

  useEffect(() => {
    setUsersLoading(true);
    getAllUsers().then(res => {
      if (res.success) setUsers(res.users);
      setUsersLoading(false);
    });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFetch = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await getPayslipForUser(form.username, selectedFY);
      if (res.success) {
        setForm({ ...initialState, ...res.data, username: form.username });
        setEditMode(true);
        setMsg('');
      } else {
        setMsg(res.message || 'Payslip not found');
      }
    } catch {
      setMsg('Error fetching payslip');
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const {
      username,
      name,
      employeeCode,
      designation,
      department,
      doj,
      employeeGroup,
      panNo,
      payPeriod,
      location,
      basic,
      houseRentAllowance,
      specialAllowance,
      tds,
      leave,
      advance,
      lop,
    } = form;

    // Get current month/year
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    try {
      const res = await updatePayslipForUser({
        username,
        financialYear: selectedFY,
        name,
        employeeCode,
        designation,
        department,
        doj: formattedDoj,
        employeeGroup,
        panNo,
        payPeriod,
        lop,
        location,
        basic,
        houseRentAllowance,
        specialAllowance,
        tds,
        leave,
        advance,
        month: currentMonth,
        year: currentYear
      });
      setMsg(res.success ? 'Payslip updated!' : res.message || 'Error');
    } catch {
      setMsg('Error updating payslip');
    }
    setLoading(false);
  };

  // Format D.O.J to dd-mm-yyyy if it is an ISO string
  let formattedDoj = form.doj;
  if (form.doj && typeof form.doj === 'string' && form.doj.includes('T')) {
    const dateObj = new Date(form.doj);
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    formattedDoj = `${dd}-${mm}-${yyyy}`;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <i className="bi bi-person-badge-fill me-2"></i>
              <h2 className='mb-0' style={{fontSize: '24px'}}>Admin: Edit Payslip for User</h2>
            </div>
            <div className="card-body">
              <form onSubmit={editMode ? handleSubmit : handleFetch} className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Select User</label>
                  {usersLoading ? (
                    <div className="form-control text-center py-2">
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Loading users...
                    </div>
                  ) : (
                    <select
                      name="username"
                      className="form-select"
                      value={form.username}
                      onChange={handleChange}
                      required
                      disabled={editMode}
                    >
                      <option value="">-- Select User --</option>
                      {users.map(u => (
                        <option key={u.username} value={u.username}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Financial Year</label>
                  <select
                    className="form-select"
                    value={selectedFY}
                    onChange={e => setSelectedFY(e.target.value)}
                    disabled={editMode}
                  >
                    {financialYears.map(fy => (
                      <option key={fy.value} value={fy.value}>{fy.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  {!editMode && (
                    <button className="btn btn-success w-100" type="submit" disabled={loading || usersLoading || !form.username}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Fetching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Fetch Payslip
                        </>
                      )}
                    </button>
                  )}
                  {editMode && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setForm(initialState);
                        setEditMode(false);
                        setMsg('');
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Edit Another User
                    </button>
                  )}
                </div>
              </form>
              {msg && <div className="alert alert-info mt-3">{msg}</div>}
              {/* Edit Panel */}
              {editMode && (
                <div className="mt-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <b>Payslip Details for: {form.username} ({selectedFY})</b>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Name</label>
                          <input name="name" className="form-control" value={form.name} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Employee Code</label>
                          <input name="employeeCode" className="form-control" value={form.employeeCode} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Designation</label>
                          <input name="designation" className="form-control" value={form.designation} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Department</label>
                          <input name="department" className="form-control" value={form.department} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Employee Group</label>
                          <input name="employeeGroup" className="form-control" value={form.employeeGroup} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">D.O.J</label>
                          <input name="doj" className="form-control" value={formattedDoj} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">PAN No</label>
                          <input name="panNo" className="form-control" value={form.panNo} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Gender</label>
                          <input name="gender" className="form-control" value={form.gender} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Pay Period</label>
                          <input name="payPeriod" className="form-control" value={form.payPeriod} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Location</label>
                          <input name="location" className="form-control" value={form.location} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Basic</label>
                          <input name="basic" type="number" className="form-control" value={form.basic} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">House Rent Allowance</label>
                          <input name="houseRentAllowance" type="number" className="form-control" value={form.houseRentAllowance} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Special Allowance</label>
                          <input name="specialAllowance" type="number" className="form-control" value={form.specialAllowance} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">T.D.S</label>
                          <input name="tds" type="number" className="form-control" value={form.tds} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Advance</label>
                          <input name="advance" type="number" className="form-control" value={form.advance} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Leave</label>
                          <input name="leave" type="number" className="form-control" value={form.leave} onChange={handleChange} />
                        </div>
                        {/* <div className="col-md-4">
                          <label className="form-label">Bank</label>
                          <input name="bank" className="form-control" value={form.bank} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Bank Account No</label>
                          <input name="bankAccountNo" className="form-control" value={form.bankAccountNo} onChange={handleChange} />
                        </div> */}
                        <div className="col-md-4">
                          <label className="form-label">UAN</label>
                          <input name="uan" className="form-control" value={form.uan} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Loss of Pay (LOP)</label>
                          <input name="lop" className="form-control" value={form.lop} onChange={handleChange} />
                        </div>
                        <div className="col-12 text-end">
                          <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-save me-2"></i>
                                Save Payslip
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayslipEditPage;