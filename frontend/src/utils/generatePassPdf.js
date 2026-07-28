import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logoUrl from '@/assets/Logo.webp';

/**
 * Generates an official, high-resolution Government of Maharashtra Kumbh Registration Pass PDF.
 * Layout architecture:
 * 1. 600px full-width export canvas matching A4 printable aspect ratio
 * 2. Page-level Logo.webp (24px left margin, 24px top margin) spanning full header width
 * 3. 100% mathematically centered Government Header ("महाराष्ट्र शासन" on a single line)
 * 4. Premium Saffron Divider with centered ◈ motif
 * 5. Centered 380px 1:1 Visual Replica Entry Pass Card
 * 6. Footer Saffron Divider with centered ◈ motif & timestamped official footer
 * 7. 185mm Printable PDF Width with ~12.5mm page margins and dynamic single-page A4 scaling
 */
export const generatePassPdf = async (params = {}, filename = 'digital-pass.pdf') => {
  // Extract data from params
  const pilgrimName = params.pilgrimName || 'Pilgrim';
  const registrationNumber = params.registrationNumber || '';
  const eventName = params.eventName || 'Simhastha Kumbh Mela 2027';
  const statusLabel = params.statusLabel || 'Submitted';
  const rawVerification = String(params.verificationLabel || 'PENDING').toUpperCase();
  const accommodation = params.accommodation || '—';
  const qrImage = params.qrImage || null;
  const profilePhotoUrl = params.profilePhotoUrl || null;
  const rejectionReason = params.rejectionReason || null;
  const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

  // Verification status badges
  let vBadgeBg = '#fef3c7'; // Amber
  let vBadgeText = '#92400e';
  let vBadgeLabel = 'PENDING';
  if (rawVerification === 'APPROVED') {
    vBadgeBg = '#dcfce7'; // Green
    vBadgeText = '#166534';
    vBadgeLabel = 'APPROVED';
  } else if (rawVerification === 'REJECTED') {
    vBadgeBg = '#fee2e2'; // Red
    vBadgeText = '#991b1b';
    vBadgeLabel = 'REJECTED';
  }

  // Activation Banner setup
  let bannerBg = '#fee2e2';
  let bannerBorder = '#fca5a5';
  let bannerTitleColor = '#991b1b';
  let bannerTitle = 'ENTRY PASS NOT YET ACTIVATED';
  let bannerMessage = 'QR Code available after on-site identity verification.';

  if (rawVerification === 'APPROVED') {
    bannerBg = '#dcfce7';
    bannerBorder = '#86efac';
    bannerTitleColor = '#166534';
    bannerTitle = 'ENTRY PASS ACTIVE';
    bannerMessage = 'Your QR Code is active and ready for event entry.';
  } else if (rawVerification === 'REJECTED') {
    bannerBg = '#fee2e2';
    bannerBorder = '#fca5a5';
    bannerTitleColor = '#991b1b';
    bannerTitle = 'ENTRY PASS UNAVAILABLE';
    bannerMessage = 'Your Entry Pass cannot be activated until verification is successfully completed.';
  }

  // Create isolated iframe for clean rendering without site CSS interference (600px width mapping to A4 printable area)
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
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { background: #ffffff; margin: 0; padding: 0; width: 600px; }
        
        .pdf-page-container {
          background: #ffffff;
          width: 100%;
          margin: 0;
          padding: 0;
          position: relative;
        }

        /* ── 1. FULL-WIDTH GOVERNMENT HEADER (LOGO AT ABSOLUTE TOP-LEFT) ── */
        .gov-header-section {
          position: relative;
          width: 100%;
          padding-top: 24px;
          min-height: 105px;
        }
        .gov-logo-left {
          position: absolute;
          left: 24px;
          top: 24px;
          width: 75px;
          height: 75px;
          object-fit: contain;
          z-index: 10;
        }
        .gov-heading-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .gov-title-marathi {
          font-size: 34px;
          font-weight: 800;
          color: #000000;
          line-height: 1.2;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }
        .gov-subtitle-english {
          font-size: 13.5px;
          font-weight: 600;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 8px;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }
        .kumbh-pass-brand {
          font-size: 12px;
          font-weight: 800;
          color: #ea580c;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }

        /* ── 2. SAFFRON DIVIDER WITH ◈ MOTIF ── */
        .saffron-divider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 82%;
          margin: 28px auto 28px auto;
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
          font-size: 15px;
          font-weight: bold;
          background: #ffffff;
          line-height: 1;
        }

        /* ── 3. CENTERED ENTRY PASS CARD REPLICA (380px FIXED WIDTH) ── */
        .entry-pass-card {
          width: 380px;
          margin: 0 auto;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
        }
        .card-header-strip {
          background: #ffedd5;
          padding: 10px 16px;
          text-align: center;
        }
        .card-header-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #ea580c;
          text-transform: uppercase;
        }
        .card-body { padding: 16px; text-align: center; }
        .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; margin-bottom: 14px; }
        .avatar-box {
          width: 56px; height: 56px; border-radius: 50%; background: #f1f5f9;
          border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center;
          overflow: hidden; margin: 0 auto;
        }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .pilgrim-name { font-size: 16.5px; font-weight: 700; color: #0f172a; text-align: center; }

        .divider-inner { height: 1px; background: #e2e8f0; margin: 12px 0; }

        /* ── QR SECTION ── */
        .qr-container { display: flex; justify-content: center; align-items: center; padding: 10px; }
        .qr-img { width: 160px; height: 160px; border-radius: 12px; padding: 8px; background: #ffffff; border: 1px solid #e2e8f0; }
        .locked-qr {
          width: 160px; height: 160px; border-radius: 12px; background: #f8fafc;
          border: 1px solid #cbd5e1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px; margin: 0 auto;
        }
        .lock-icon { width: 36px; height: 36px; border-radius: 50%; background: #ffedd5; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; }
        .protected-text { font-size: 9px; font-weight: 700; color: #64748b; letter-spacing: 0.15em; text-transform: uppercase; }

        /* ── INFO ROWS (UNIFORM 40px HEIGHT & ALIGNED BADGES) ── */
        .rows { display: flex; flex-direction: column; border-top: 1px solid #f1f5f9; margin-top: 8px; }
        .row { display: flex; justify-content: space-between; align-items: center; height: 40px; padding: 0 16px; border-bottom: 1px solid #f1f5f9; }
        .row-label { font-size: 12px; color: #64748b; text-align: left; }
        .row-value { font-size: 12px; font-weight: 600; color: #0f172a; text-align: right; }
        .badge { font-size: 10.5px; font-weight: 600; padding: 0 12px; height: 26px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; line-height: 1; }

        /* ── ACTIVATION BANNER ── */
        .activation-banner {
          background: ${bannerBg};
          border-top: 1px solid ${bannerBorder};
          padding: 12px 16px;
          text-align: center;
          margin-top: 4px;
        }
        .banner-title { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: ${bannerTitleColor}; text-transform: uppercase; margin-bottom: 4px; text-align: center; }
        .banner-msg { font-size: 9.5px; color: #475569; display: flex; align-items: center; justify-content: center; gap: 5px; text-align: center; }

        /* ── 4 & 5. FOOTER DIVIDER & OFFICIAL FOOTER ── */
        .footer-divider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 82%;
          margin: 24px auto 16px auto;
          position: relative;
        }
        .gov-footer-section {
          text-align: center;
          padding: 0 16px 16px 16px;
        }
        .footer-notice { font-size: 9.5px; color: #475569; margin-bottom: 6px; }
        .footer-time { font-size: 9px; color: #64748b; font-family: monospace; margin-bottom: 6px; }
        .footer-system { font-size: 9.5px; font-weight: 600; color: #1e293b; text-transform: uppercase; letter-spacing: 0.06em; }
      </style>
    </head>
    <body>
      <div class="pdf-page-container">
        <!-- 1. FULL-WIDTH GOVERNMENT HEADER (LOGO AT ABSOLUTE PAGE TOP-LEFT) -->
        <div class="gov-header-section">
          <img src="${logoUrl}" class="gov-logo-left" alt="Government of Maharashtra" />
          <div class="gov-heading-block">
            <div class="gov-title-marathi">महाराष्ट्र शासन</div>
            <div class="gov-subtitle-english">Government of Maharashtra</div>
            <div class="kumbh-pass-brand">Kumbh Registration Pass</div>
          </div>
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
              ${qrImage ? `<img src="${qrImage}" class="qr-img" />` : `
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
                <span class="badge" style="background:#e0f2fe;color:#0369a1;">${statusLabel}</span>
              </div>
              <div class="row">
                <span class="row-label">Verification</span>
                <span class="badge" style="background:${vBadgeBg};color:${vBadgeText};">${vBadgeLabel}</span>
              </div>
              <div class="row">
                <span class="row-label">Accommodation</span>
                <span class="row-value">${accommodation}</span>
              </div>
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
          <div class="footer-system">Government of Maharashtra • Kumbh Registration System</div>
        </div>
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Ensure image and font loading inside iframe
  await new Promise((resolve) => setTimeout(resolve, 200));

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

    // Dynamically scale down proportionally if rendered height exceeds available A4 single page height
    if (imgHeight > maxCanvasHeight) {
      imgHeight = maxCanvasHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
};

export default generatePassPdf;
