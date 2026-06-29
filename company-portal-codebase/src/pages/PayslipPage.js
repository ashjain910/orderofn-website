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

  const activeFYLabel = financialYears.find(f => f.value === selectedFY)?.label || '';

  return (
    <div className="portal-page">
      <div className="row justify-content-center g-0">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="portal-card">

            {/* Header */}
            <div className="portal-card-header">
              <i className="bi bi-file-earmark-pdf-fill" style={{ fontSize: '1.2rem' }}></i>
              <h5>Payslips</h5>
              {!loadingData && filteredMonths.length > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 20,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}>
                  {filteredMonths.length} payslip{filteredMonths.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="portal-card-body">
              {error && <div className="portal-alert-error"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

              {/* FY Tabs */}
              <div className="d-flex mb-3">
                {financialYears.map(fy => (
                  <button
                    key={fy.value}
                    className={`portal-tab ${selectedFY === fy.value ? 'active' : 'inactive'}`}
                    onClick={() => setSelectedFY(fy.value)}
                  >
                    <i className="bi bi-calendar2-range"></i>
                    FY {fy.value}
                  </button>
                ))}
              </div>

              {/* FY period info */}
              {activeFYLabel && (
                <div className="portal-info-banner mb-4" style={{ padding: '9px 14px' }}>
                  <i className="bi bi-info-circle-fill" style={{ flexShrink: 0, marginTop: 1 }}></i>
                  <span style={{ fontSize: '0.83rem' }}>{activeFYLabel}</span>
                </div>
              )}

              {loadingData ? (
                <div className="portal-empty">
                  <span className="spinner-border spinner-border-sm me-2"></span>Loading…
                </div>
              ) : filteredMonths.length === 0 ? (
                <div className="portal-empty">
                  <i className="bi bi-file-earmark-x" style={{ fontSize: '2.4rem', display: 'block', marginBottom: 10, color: '#c5cdd8' }}></i>
                  <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No payslips available</div>
                  <div style={{ fontSize: '0.82rem' }}>Payslips for this period haven't been uploaded yet.</div>
                </div>
              ) : (
                <div className="payslip-list">
                  {filteredMonths.map((m, idx) => {
                    const date = new Date(m.year, m.num - 1, 1);
                    const monthLong  = date.toLocaleString('default', { month: 'long' });
                    const monthShort = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                    const isDownloading = loadingIdx === idx;
                    return (
                      <div key={`${m.num}-${m.year}`} className="payslip-row">
                        <div className="payslip-month-badge">
                          <div className="payslip-month-short">{monthShort}</div>
                          <div className="payslip-month-year">{m.year}</div>
                        </div>
                        <div className="payslip-row-info">
                          <div className="payslip-row-title">{monthLong} {m.year}</div>
                          <div className="payslip-row-sub">
                            <i className="bi bi-file-earmark-pdf me-1"></i>PDF Payslip · FY {selectedFY}
                          </div>
                        </div>
                        <button
                          className="portal-btn portal-btn-sm"
                          onClick={() => handleDownload(m.num, m.year, idx)}
                          disabled={isDownloading}
                        >
                          {isDownloading
                            ? <><span className="spinner-border spinner-border-sm"></span> Preparing…</>
                            : <><i className="bi bi-download"></i> Download</>
                          }
                        </button>
                      </div>
                    );
                  })}
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
