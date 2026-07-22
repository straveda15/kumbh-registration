import jsPDF from 'jspdf';

// Pure jsPDF text/vector drawing — deliberately NOT html2canvas (see
// generatePassPdf.js's DOM-capture approach). This app's CSS leans heavily
// on oklch() colors and backdrop-filter blur, which html2canvas can hang on
// indefinitely with no error, no resolution — capturing a rendered node is
// the wrong tool for a plain confirmation document anyway.
export const generateAcknowledgementPdf = ({ registrationNumber }) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let y = 28;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Kumbh Registration Portal', centerX, y, { align: 'center' });

  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(90);
  pdf.text('Registration Acknowledgement', centerX, y, { align: 'center' });

  y += 16;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(20);
  pdf.text('Registration Successful', centerX, y, { align: 'center' });

  y += 14;
  pdf.setDrawColor(255, 140, 26);
  pdf.setLineWidth(0.9);
  pdf.roundedRect(25, y, pageWidth - 50, 24, 3, 3);
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(20);
  pdf.text(registrationNumber, centerX, y + 15, { align: 'center' });

  y += 34;
  pdf.setFontSize(10);
  const thankYou = pdf.splitTextToSize(
    'Thank you for registering for Simhastha Kumbh 2027.',
    pageWidth - 50
  );
  pdf.text(thankYou, centerX, y, { align: 'center' });
  y += thankYou.length * 5 + 6;

  const note = pdf.splitTextToSize(
    'Please save this Registration Number. It will be required to log in and access your Pilgrim Dashboard.',
    pageWidth - 50
  );
  pdf.text(note, centerX, y, { align: 'center' });
  y += note.length * 5 + 12;

  pdf.setFontSize(8);
  pdf.setTextColor(130);
  pdf.text(`Generated on ${new Date().toLocaleString()}`, centerX, y, { align: 'center' });

  pdf.save(`${registrationNumber}-acknowledgement.pdf`);
};

export default generateAcknowledgementPdf;
