import React, { useState } from 'react';
import { fetchPayslipPdf, updatePayslipHeader } from '../api/googleScriptApi';
import { PDFDocument } from 'pdf-lib';

const PayslipPage = () => {
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [error, setError] = useState('');
  const [selectedFY, setSelectedFY] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const auth = JSON.parse(localStorage.getItem('auth'));

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const fyStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;
  const fyEndYear = fyStartYear + 1;
  const fyString = (start, end) => `${String(start).slice(-2)}-${String(end).slice(-2)}`;

  const financialYears = [
    { label: `April ${fyStartYear} – March ${fyEndYear}`, value: fyString(fyStartYear, fyEndYear) },
    { label: `April ${fyStartYear - 1} – March ${fyStartYear}`, value: fyString(fyStartYear - 1, fyStartYear) },
  ];

  React.useEffect(() => { setSelectedFY(financialYears[0].value); setLoadingData(false); }, []); // eslint-disable-line

  const handleDownload = async (month, year, idx) => {
    setLoadingIdx(idx); setError('');
    try {
      await updatePayslipHeader(auth?.username, month, year, selectedFY);
      const res = await fetchPayslipPdf(auth?.username, selectedFY, auth?.token);
      if (res.success && res.filedata) {
        const pdfBytes = Uint8Array.from(atob(res.filedata), c => c.charCodeAt(0));
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPage(0);
        const { width, height } = page.getSize();
        const cropHeight = height * 0.6;
        page.setCropBox(0, height - cropHeight, width, cropHeight);
        page.setMediaBox(0, height - cropHeight, width, cropHeight);
        const croppedPdfBytes = await pdfDoc.save();
        const blob = new Blob([croppedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Payslip-${auth?.username}-${String(month).padStart(2, '0')}-${year}-FY${selectedFY}.pdf`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
      } else {
        setError(res.message || 'Payslip not found');
        alert(res.message || 'Payslip not found');
      }
    } catch { setError('Error fetching payslip'); }
    setLoadingIdx(null);
  };

  const getMonthsForFY = (fy) => {
    const [start, end] = fy.split('-').map(y => Number('20' + y));
    const months = [];
    for (let m = 4; m <= 12; m++) months.push({ num: m, year: start });
    for (let m = 1; m <= 3; m++) months.push({ num: m, year: end });
    return months;
  };

  const months = selectedFY ? getMonthsForFY(selectedFY) : [];
  const currentFY = fyString(fyStartYear, fyEndYear);
  const previousFY = fyString(fyStartYear - 1, fyStartYear);

  const filteredMonths = months.filter(m => {
    if (selectedFY === currentFY) return m.year < currentYear || (m.year === currentYear && m.num < currentMonth);
    if (selectedFY === previousFY) return m.year === fyStartYear && m.num === 3;
    return false;
  });

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="portal-card">
            <div className="portal-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '1.2rem' }}></i>
              <h5 style={{ flexGrow: 1 }}>Payslips</h5>
              <select
                className="portal-select"
                value={selectedFY || ''}
                onChange={e => setSelectedFY(e.target.value)}
                style={{ height: 36, width: 'auto', minWidth: 200, fontSize: '0.85rem', background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                {financialYears.map(fy => <option key={fy.value} value={fy.value} style={{ color: '#000' }}>{fy.label}</option>)}
              </select>
            </div>
            <div className="portal-card-body">
              {error && <div className="portal-alert-error">{error}</div>}
              {loadingData ? (
                <div className="portal-empty"><span className="spinner-border spinner-border-sm me-2"></span>Loading…</div>
              ) : filteredMonths.length === 0 ? (
                <div className="portal-empty"><i className="bi bi-file-earmark-x" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}></i>No payslips available yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th className="text-end">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMonths.map((m, idx) => {
                        const date = new Date(m.year, m.num - 1, 1);
                        const label = `${date.toLocaleString('default', { month: 'long' })} ${m.year}`;
                        return (
                          <tr key={label}>
                            <td>
                              <i className="bi bi-calendar-event me-2" style={{ color: '#000033' }}></i>
                              <span className="fw-semibold">{label}</span>
                            </td>
                            <td className="text-end">
                              <button className="portal-btn portal-btn-sm portal-btn-success" onClick={() => handleDownload(m.num, m.year, idx)} disabled={loadingIdx === idx}>
                                {loadingIdx === idx ? <><span className="spinner-border spinner-border-sm"></span> Downloading…</> : <><i className="bi bi-download"></i> Download</>}
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
