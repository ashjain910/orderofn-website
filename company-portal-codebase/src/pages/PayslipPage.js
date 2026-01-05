import React, { useState } from 'react';
import { fetchPayslipPdf, updatePayslipHeader } from '../api/googleScriptApi';
import { PDFDocument } from 'pdf-lib';

const PayslipPage = () => {
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [error, setError] = useState('');
  const [selectedFY, setSelectedFY] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const auth = JSON.parse(localStorage.getItem('auth'));

  // Calculate current and previous financial years (April-March)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-based

  // If before April, financial year started last year
  const fyStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;
  const fyEndYear = fyStartYear + 1;
  const prevFyStartYear = fyStartYear - 1;
  const prevFyEndYear = fyStartYear;

  // Format as "24-25"
  const fyString = (start, end) => `${String(start).slice(-2)}-${String(end).slice(-2)}`;

  // Dynamically generate financial years: current and next (April-March)
  const financialYears = [
    {
      label: `April ${fyStartYear} - March ${fyEndYear}`,
      value: fyString(fyStartYear, fyEndYear)
    },
    {
      label: `April ${fyEndYear} - March ${fyEndYear + 1}`,
      value: fyString(fyEndYear, fyEndYear + 1)
    }
  ];

  // Default to current FY
  React.useEffect(() => {
    setSelectedFY(financialYears[0].value);
    setLoadingData(false);
    // eslint-disable-next-line
  }, []);

  const handleDownload = async (month, year, idx) => {
    setLoadingIdx(idx);
    setError('');
    try {
      await updatePayslipHeader(auth?.username, month, year, selectedFY);
      const res = await fetchPayslipPdf(auth?.username, selectedFY, auth?.token);
      if (res.success && res.filedata) {
        const pdfBytes = Uint8Array.from(atob(res.filedata), c => c.charCodeAt(0));
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Crop the first page to 60% of its height from the top
        const page = pdfDoc.getPage(0);
        const { width, height } = page.getSize();
        const cropHeight = height * 0.6;
        page.setCropBox(0, height - cropHeight, width, cropHeight);
        page.setMediaBox(0, height - cropHeight, width, cropHeight);

        const croppedPdfBytes = await pdfDoc.save();
        const blob = new Blob([croppedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Set filename as Payslip-username-month-year-fy.pdf
        const monthStr = month.toString().padStart(2, '0');
        const filename = `Payslip-${auth?.username}-${monthStr}-${year}-FY${selectedFY}.pdf`;

        // Auto-download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError(res.message || 'Payslip not found');
        alert(res.message || 'Payslip not found');
      }
    } catch {
      setError('Error fetching payslip');
    }
    setLoadingIdx(null);
  };

  // Generate months for selected FY
  const getMonthsForFY = (fy) => {
    const [start, end] = fy.split('-').map(y => Number('20' + y));
    const months = [];
    for (let m = 4; m <= 12; m++) months.push({ num: m, year: start });
    for (let m = 1; m <= 3; m++) months.push({ num: m, year: end });
    return months;
  };

  // Filter months: for current FY, only up to previous month; for previous FY, show all
  const months = selectedFY ? getMonthsForFY(selectedFY) : [];
  const filteredMonths = months.filter(m => {
    if (selectedFY === fyString(fyStartYear, fyEndYear)) {
      // Current FY: only up to previous month
      if (m.year < today.getFullYear() || (m.year === today.getFullYear() && m.num < currentMonth)) {
        return true;
      }
      return false;
    }
    // Previous FY: show all
    return true;
  });

  // Hide "April 2026 - March 2027" if today is before April 2026
  const visibleFinancialYears = financialYears.filter(fy => {
    if (fy.value === '26-27') {
      // Only show if today is April 2026 or later
      return today.getFullYear() > 2026 || (today.getFullYear() === 2026 && currentMonth >= 4);
    }
    return true;
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-lg border-0" style={{ borderRadius: 18 }}>
            <div className="card-header bg-primary text-white d-flex align-items-center" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
              <i className="bi bi-file-earmark-pdf-fill me-2 fs-4"></i>
              <h4 className="mb-0 flex-grow-1">
                Payslips: Financial Year&nbsp;
                <select
                  className="form-select form-select-sm d-inline-block w-auto ms-2"
                  value={selectedFY || ''}
                  onChange={e => setSelectedFY(e.target.value)}
                  style={{ fontWeight: 600, minWidth: 120 }}
                >
                  {visibleFinancialYears.map(fy => (
                    <option key={fy.value} value={fy.value}>{fy.label}</option>
                  ))}
                </select>
              </h4>
            </div>
            <div className="card-body" style={{ background: '#f8fafc', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
              {error && <div className="alert alert-danger">{error}</div>}
              {loadingData ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 180 }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start" style={{ width: '60%' }}>Month</th>
                        <th className="text-end">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMonths.map((m, idx) => {
                        const date = new Date(m.year, m.num - 1, 1);
                        const label = `${date.toLocaleString('default', { month: 'long' })} ${m.year}`;
                        return (
                          <tr key={label} style={{ verticalAlign: 'middle' }}>
                            <td className="text-start">
                              <span className="fw-bold">
                                <i className="bi bi-calendar-event me-2 text-primary"></i>
                                {label}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-success btn-sm px-3"
                                onClick={() => handleDownload(m.num, m.year, idx)}
                                disabled={loadingIdx === idx}
                                style={{ fontWeight: 600, borderRadius: 8, minWidth: 120 }}
                              >
                                {loadingIdx === idx ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Downloading...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-download me-2"></i>
                                    Download
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipPage;