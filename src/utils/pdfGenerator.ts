import { jsPDF } from 'jspdf';
import { ColoringBook } from '../types';

export async function generateColoringBookPDF(
  book: ColoringBook,
  onProgress?: (progressText: string, percentage: number) => void
): Promise<Blob> {
  // Create letter size document in inches (8.5 x 11 in)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.5;
  const printableWidth = pageWidth - margin * 2; // 7.5 in

  onProgress?.('Preparing cover page...', 10);

  // ==========================================
  // PAGE 1: COVER
  // ==========================================
  // Outer decorative border
  doc.setLineWidth(0.04);
  doc.setDrawColor(30, 30, 30);
  doc.rect(margin, margin, printableWidth, pageHeight - margin * 2);

  // Inner border
  doc.setLineWidth(0.015);
  doc.rect(margin + 0.08, margin + 0.08, printableWidth - 0.16, pageHeight - margin * 2 - 0.16);

  // Child's Name & Header banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(20, 20, 20);

  const personalizedTitle = `${book.childName.toUpperCase()}'S`;
  doc.text(personalizedTitle, pageWidth / 2, margin + 0.7, { align: 'center' });

  // Main Book Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(book.bookTitle || `${book.theme} Coloring Book`, printableWidth - 0.5);
  doc.text(titleLines, pageWidth / 2, margin + 1.1, { align: 'center' });

  // Subtitle
  if (book.bookSubtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const subLines = doc.splitTextToSize(book.bookSubtitle, printableWidth - 0.8);
    doc.text(subLines, pageWidth / 2, margin + 1.6, { align: 'center' });
  }

  // Cover image (if exists)
  const coverImageY = margin + 1.9;
  const coverImageHeight = 5.6;
  const coverImageWidth = (coverImageHeight * 3) / 4; // 3:4 aspect ratio = 4.2 in
  const coverImageX = (pageWidth - coverImageWidth) / 2;

  if (book.coverImageUrl) {
    try {
      doc.addImage(book.coverImageUrl, 'PNG', coverImageX, coverImageY, coverImageWidth, coverImageHeight);
      // Clean thin border around image
      doc.setLineWidth(0.02);
      doc.setDrawColor(40, 40, 40);
      doc.rect(coverImageX, coverImageY, coverImageWidth, coverImageHeight);
    } catch (err) {
      console.warn('Could not embed cover image in PDF:', err);
    }
  } else {
    // Placeholder frame for child to draw their own cover
    doc.setLineWidth(0.03);
    doc.setDrawColor(60, 60, 60);
    doc.rect(coverImageX, coverImageY, coverImageWidth, coverImageHeight);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Draw Your Own Cover Here!', pageWidth / 2, coverImageY + coverImageHeight / 2, {
      align: 'center',
    });
  }

  // Bottom "Artist Credit" lines
  const artistY = pageHeight - margin - 1.1;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text('MASTERPIECE CREATED BY:', pageWidth / 2, artistY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`Name: _______________________________      Date: _______________`, pageWidth / 2, artistY + 0.35, {
    align: 'center',
  });

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text('Print on standard 8.5" x 11" paper • Perfect for crayons, markers, and colored pencils!', pageWidth / 2, pageHeight - margin - 0.25, {
    align: 'center',
  });

  // ==========================================
  // PAGES 2 - 6: 5 COLORING PAGES
  // ==========================================
  const totalPages = book.pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = book.pages[i];
    const progressPercent = 20 + Math.round(((i + 1) / totalPages) * 75);
    onProgress?.(`Adding Page ${i + 1} of ${totalPages}: ${page.title}...`, progressPercent);

    doc.addPage('letter', 'portrait');

    // Page border
    doc.setLineWidth(0.025);
    doc.setDrawColor(40, 40, 40);
    doc.rect(margin, margin, printableWidth, pageHeight - margin * 2);

    // Header bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`${book.childName}'s Coloring Adventure`, margin + 0.2, margin + 0.35);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${page.pageNumber} of ${totalPages}`, pageWidth - margin - 0.2, margin + 0.35, {
      align: 'right',
    });

    // Divider line below header
    doc.setLineWidth(0.01);
    doc.setDrawColor(180, 180, 180);
    doc.line(margin + 0.2, margin + 0.45, pageWidth - margin - 0.2, margin + 0.45);

    // Page Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    const titleLines = doc.splitTextToSize(page.title, printableWidth - 0.4);
    doc.text(titleLines, pageWidth / 2, margin + 0.8, { align: 'center' });

    // Coloring Image Area
    const imgY = margin + 1.1;
    const imgHeight = 7.1;
    const imgWidth = (imgHeight * 3) / 4; // 3:4 aspect ratio = ~5.32 in
    const imgX = (pageWidth - imgWidth) / 2;

    if (page.imageUrl) {
      try {
        doc.addImage(page.imageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
        // Neat border around image
        doc.setLineWidth(0.02);
        doc.setDrawColor(40, 40, 40);
        doc.rect(imgX, imgY, imgWidth, imgHeight);
      } catch (e) {
        console.warn(`Could not add image for page ${page.pageNumber}:`, e);
      }
    } else {
      // Empty box for drawing if not ready
      doc.setLineWidth(0.02);
      doc.setDrawColor(100, 100, 100);
      doc.rect(imgX, imgY, imgWidth, imgHeight);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(140, 140, 140);
      doc.text('(Coloring page image pending)', pageWidth / 2, imgY + imgHeight / 2, { align: 'center' });
    }

    // Story Caption at bottom
    if (page.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const descLines = doc.splitTextToSize(page.description, printableWidth - 0.6);
      doc.text(descLines, pageWidth / 2, pageHeight - margin - 0.75, { align: 'center' });
    }

    // Bottom decorative footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`Theme: ${book.theme} • Personal coloring edition for ${book.childName}`, pageWidth / 2, pageHeight - margin - 0.25, {
      align: 'center',
    });
  }

  onProgress?.('Finalizing PDF package...', 100);
  return doc.output('blob');
}
