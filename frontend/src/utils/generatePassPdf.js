import jsPDF from 'jspdf';

// Pure jsPDF text/vector drawing — deliberately NOT html2canvas. The old
// implementation captured the live glass-card DOM node, which this app's
// oklch()/backdrop-filter-heavy CSS makes html2canvas hang on indefinitely
// with no error (see generateAcknowledgementPdf.js's notes on the same
// issue) — that's why Download silently never completed. Drawing the pass
// as plain vector content sidesteps the whole DOM-capture problem, and as
// a bonus the QR renders at full source resolution instead of whatever the
// on-screen capture happened to rasterize it at.
export const generatePassPdf = (
  {
    pilgrimName,
    registrationNumber,
    hideRegistrationNumber = false,
    eventName,
    statusLabel,
    verificationLabel,
    accommodation,
    qrImage,
  },
  filename = 'digital-pass.pdf'
) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let y = 26;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(20);
  pdf.text('Kumbh Registration Pass', centerX, y, { align: 'center' });

  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(90);
  pdf.text(pilgrimName || 'Pilgrim', centerX, y, { align: 'center' });

  y += 12;
  if (qrImage) {
    const qrSize = 60;
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(centerX - qrSize / 2 - 4, y, qrSize + 8, qrSize + 8, 3, 3);
    pdf.addImage(qrImage, 'PNG', centerX - qrSize / 2, y + 4, qrSize, qrSize);
    y += qrSize + 18;
  } else {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(120);
    pdf.text('Entry QR code will be available after identity verification.', centerX, y + 6, {
      align: 'center',
    });
    y += 20;
  }

  const rows = [
    !hideRegistrationNumber && registrationNumber ? ['Registration No.', registrationNumber] : null,
    ['Event', eventName || '—'],
    ['Registration Status', statusLabel || '—'],
    ['Verification', verificationLabel || '—'],
    ['Accommodation', accommodation || '—'],
  ].filter(Boolean);

  pdf.setFontSize(10.5);
  const tableWidth = pageWidth - 50;
  const rowHeight = 10;
  rows.forEach(([label, value], index) => {
    const rowY = y + index * rowHeight;
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.2);
    pdf.line(25, rowY + rowHeight, pageWidth - 25, rowY + rowHeight);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(110);
    pdf.text(label, 25, rowY + 6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(20);
    const valueLines = pdf.splitTextToSize(String(value), tableWidth * 0.55);
    pdf.text(valueLines, pageWidth - 25, rowY + 6.5, { align: 'right' });
  });

  y += rows.length * rowHeight + 16;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(140);
  pdf.text('Please carry a valid government-issued ID along with this pass.', centerX, y, {
    align: 'center',
  });
  y += 6;
  pdf.text(`Generated on ${new Date().toLocaleString()}`, centerX, y, { align: 'center' });

  pdf.save(filename);
};

export default generatePassPdf;
