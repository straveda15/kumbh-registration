import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates an official, high-resolution Government of Maharashtra Kumbh Registration Pass PDF.
 * Exact 1:1 replica of the on-screen Registration Pass UI.
 */
export const generatePassPdf = async (params = {}, filename = 'digital-pass.pdf') => {
  const pilgrimName = params.pilgrimName || 'Pilgrim';
  const registrationNumber = params.registrationNumber || '';
  const eventName = params.eventName || 'Simhastha Kumbh Mela 2027';
  const statusLabel = params.statusLabel || 'Pending';
  const rawVerification = String(params.verificationLabel || 'PENDING').toUpperCase();
  const accommodation = params.accommodation || '';
  const qrImage = params.qrImage || null;
  const profilePhotoUrl = params.profilePhotoUrl || null;
  const rejectionReason = params.rejectionReason || null;
  const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  // Registration Status badge colors
  const normStatus = String(statusLabel || '').trim().toLowerCase();
  const isRegApproved = normStatus === 'approved';
  const isRegRejected = normStatus === 'rejected';

  let regBadgeBg = '#fef3c7'; // Amber
  let regBadgeText = '#92400e';
  if (isRegApproved) {
    regBadgeBg = '#dcfce7'; // Green
    regBadgeText = '#166534';
  } else if (isRegRejected) {
    regBadgeBg = '#fee2e2'; // Red
    regBadgeText = '#991b1b';
  }

  // On-Site Verification badge colors
  let vBadgeBg = '#fef3c7'; // Amber
  let vBadgeText = '#92400e';
  let vBadgeLabel = 'Pending';
  if (rawVerification === 'APPROVED') {
    vBadgeBg = '#dcfce7'; // Green
    vBadgeText = '#166534';
    vBadgeLabel = 'Approved';
  } else if (rawVerification === 'REJECTED') {
    vBadgeBg = '#fee2e2'; // Red
    vBadgeText = '#991b1b';
    vBadgeLabel = 'Rejected';
  }

  // Activation Banner setup
  let bannerBg = '#fef3c7';
  let bannerBorder = '#fde68a';
  let bannerTitleColor = '#92400e';
  let bannerTitle = 'ENTRY PASS NOT YET ACTIVATED';
  const bannerMessage = 'QR Code will be activated after On-Site Verification approval.';

  if (isRegApproved) {
    bannerBg = '#dcfce7';
    bannerBorder = '#86efac';
    bannerTitleColor = '#166534';
    bannerTitle = 'ENTRY PASS ACTIVE';
  } else if (isRegRejected) {
    bannerBg = '#fee2e2';
    bannerBorder = '#fca5a5';
    bannerTitleColor = '#991b1b';
    bannerTitle = 'ENTRY PASS UNAVAILABLE';
  }

  // Create isolated iframe for clean rendering without site CSS interference
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '600px';
  iframe.style.height = '950px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          background: #ffffff;
          margin: 0;
          padding: 0;
          width: 600px;
          color: #0f172a;
        }
        
        .pdf-page-container {
          background: #ffffff;
          width: 600px;
          margin: 0 auto;
          padding: 24px 20px;
          position: relative;
        }

        /* ── 1. CENTERED GOVERNMENT HEADER (NO LOGO & NO TOP BRAND LINE) ── */
        .gov-header-section {
          width: 100%;
          text-align: center;
          margin-bottom: 4px;
        }
        .gov-title-marathi {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
          text-align: center;
        }
        .gov-subtitle-english {
          font-size: 13px;
          font-weight: 700;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0;
          text-align: center;
        }

        /* ── 2. SAFFRON DIVIDER WITH ◈ MOTIF ── */
        .saffron-divider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 82%;
          margin: 20px auto 24px auto;
          position: relative;
        }
        .divider-line {
          flex: 1;
          height: 1.5px;
          background: #f97316;
        }
        .divider-motif {
          padding: 0 14px;
          color: #ea580c;
          font-size: 14px;
          font-weight: bold;
          background: #ffffff;
          line-height: 1;
        }

        /* ── 3. CENTERED ENTRY PASS CARD REPLICA (380px FIXED WIDTH) ── */
        .entry-pass-card {
          width: 380px;
          margin: 0 auto;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 8px 20px -4px rgba(0,0,0,0.06);
        }
        .card-header-strip {
          background: #ffedd5;
          padding: 8px 16px;
          text-align: center;
        }
        .card-header-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #ea580c;
          text-transform: uppercase;
        }
        .card-body {
          padding: 16px 16px 12px 16px;
          text-align: center;
        }
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .avatar-box {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 0 auto;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pilgrim-name {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
        }

        .divider-inner {
          height: 1px;
          background: #e2e8f0;
          margin: 12px 0;
        }

        /* ── QR SECTION ── */
        .qr-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          margin-bottom: 8px;
        }
        .qr-img {
          width: 160px;
          height: 160px;
          border-radius: 12px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .locked-qr {
          width: 160px;
          height: 160px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0 auto;
        }
        .lock-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffedd5;
          color: #ea580c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
        }
        .protected-text {
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* ── INFO ROWS ── */
        .rows {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #f1f5f9;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 36px;
          padding: 0 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .row-label {
          font-size: 12px;
          color: #64748b;
          text-align: left;
        }
        .row-value {
          font-size: 12px;
          font-weight: 500;
          color: #0f172a;
          text-align: right;
        }
        .badge {
          font-size: 10.5px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── ACTIVATION BANNER ── */
        .activation-banner {
          background: ${bannerBg};
          border-top: 1px solid ${bannerBorder};
          padding: 10px 14px;
          text-align: center;
        }
        .banner-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: ${bannerTitleColor};
          text-transform: uppercase;
          margin-bottom: 3px;
          text-align: center;
        }
        .banner-msg {
          font-size: 9.5px;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          text-align: center;
          white-space: nowrap;
        }

        /* ── FOOTER DIVIDER & OFFICIAL FOOTER ── */
        .footer-divider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 82%;
          margin: 20px auto 14px auto;
          position: relative;
        }
        .gov-footer-section {
          text-align: center;
          padding: 0 16px 16px 16px;
        }
        .footer-notice {
          font-size: 9.5px;
          color: #475569;
          margin-bottom: 4px;
          text-align: center;
        }
        .footer-time {
          font-size: 9px;
          color: #64748b;
          font-family: monospace;
          margin-bottom: 10px;
          text-align: center;
        }
        .footer-system {
          font-size: 9.5px;
          font-weight: 600;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: center;
          margin-bottom: 10px;
        }
        .footer-demo {
          font-size: 13px;
          font-weight: 700;
          color: #ea580c;
          text-transform: uppercase;
          text-align: center;
          letter-spacing: 0.05em;
        }
      </style>
    </head>
    <body>
      <div class="pdf-page-container">
        <!-- 1. FULL-WIDTH CENTERED GOVERNMENT HEADER (NO LOGO, NO PAGE-LEVEL KUMBH BRAND) -->
        <div class="gov-header-section">
          <div class="gov-title-marathi">महाराष्ट्र शासन</div>
          <div class="gov-subtitle-english">Government of Maharashtra</div>
        </div>

        <!-- 2. SAFFRON DIVIDER WITH ◈ MOTIF -->
        <div class="saffron-divider-container">
          <div class="divider-line"></div>
          <div class="divider-motif">◈</div>
          <div class="divider-line"></div>
        </div>

        <!-- 3. 1:1 CENTERED ENTRY PASS CARD REPLICA -->
        <div class="entry-pass-card">
          <div class="card-header-strip">
            <div class="card-header-title">Kumbh Registration Pass</div>
          </div>
          <div class="card-body">
            <div class="hero">
              <div class="avatar-box">
                ${profilePhotoUrl ? `<img src="${profilePhotoUrl}" class="avatar-img" />` : `<span style="font-size:24px;color:#94a3b8;">👤</span>`}
              </div>
              <div class="pilgrim-name">${pilgrimName}</div>
            </div>

            <div class="divider-inner"></div>

            <!-- QR SECTION -->
            <div class="qr-container">
              ${rawVerification === 'APPROVED' && qrImage ? `<img src="${qrImage}" class="qr-img" />` : `
                <div class="locked-qr">
                  <div class="lock-icon">🔒</div>
                  <div class="protected-text">Protected</div>
                </div>
              `}
            </div>

            <!-- INFO ROWS -->
            <div class="rows">
              ${registrationNumber ? `
                <div class="row">
                  <span class="row-label">Registration No.</span>
                  <span class="row-value" style="font-family:monospace;">${registrationNumber}</span>
                </div>
              ` : ''}
              <div class="row">
                <span class="row-label">Event</span>
                <span class="row-value">${eventName}</span>
              </div>
              <div class="row">
                <span class="row-label">Registration Status</span>
                <span class="badge" style="background:${regBadgeBg};color:${regBadgeText};">${statusLabel}</span>
              </div>
              <div class="row">
                <span class="row-label">On-Site Verification</span>
                <span class="badge" style="background:${vBadgeBg};color:${vBadgeText};">${vBadgeLabel}</span>
              </div>
              ${accommodation ? `
                <div class="row">
                  <span class="row-label">Accommodation</span>
                  <span class="row-value">${accommodation}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- ACTIVATION BANNER -->
          <div class="activation-banner">
            <div class="banner-title">${bannerTitle}</div>
            <div class="banner-msg">ⓘ ${bannerMessage}</div>
            ${rejectionReason ? `<div style="margin-top:6px;background:#fee2e2;color:#991b1b;font-size:9.5px;padding:4px;border-radius:4px;">Reason: ${rejectionReason}</div>` : ''}
          </div>
        </div>

        <!-- 4. FOOTER SAFFRON DIVIDER WITH ◈ MOTIF -->
        <div class="footer-divider-container">
          <div class="divider-line"></div>
          <div class="divider-motif">◈</div>
          <div class="divider-line"></div>
        </div>

        <!-- 5. OFFICIAL FOOTER -->
        <div class="gov-footer-section">
          <div class="footer-notice">Please carry this Entry Pass together with a valid Government-issued Photo ID.</div>
          <div class="footer-time">Generated on: ${timestamp}</div>
          <div class="footer-system">GOVERNMENT OF MAHARASHTRA • KUMBH REGISTRATION SYSTEM</div>
          <div class="footer-demo">FOR DEMO PURPOSE ONLY</div>
        </div>
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Ensure image and font loading inside iframe
  await new Promise((resolve) => setTimeout(resolve, 250));

  try {
    const targetNode = doc.body.querySelector('.pdf-page-container');
    const canvas = await html2canvas(targetNode, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Printable width: 185mm (12.5mm left & right margins)
    const maxCanvasWidth = 185; 
    const maxCanvasHeight = pageHeight - 25; // 272mm max height (12.5mm top & bottom margins)

    let imgWidth = maxCanvasWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > maxCanvasHeight) {
      imgHeight = maxCanvasHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(filename);
  } finally {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }
};

export default generatePassPdf;
