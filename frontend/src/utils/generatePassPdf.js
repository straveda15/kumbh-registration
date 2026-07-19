import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Client-side only — captures the already-rendered pass DOM node and lays
// it into an A4 PDF. No backend PDF endpoint (see increment 5 plan notes).
export const generatePassPdf = async (element, filename = 'digital-pass.pdf') => {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#0b0d12',
    useCORS: true,
  });
  const imageData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const x = (pageWidth - imgWidth) / 2;
  const y = Math.max(10, (pageHeight - imgHeight) / 2);

  pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(filename);
};

export default generatePassPdf;
