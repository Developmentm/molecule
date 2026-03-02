import PDFDocument from 'pdfkit';

export function buildPdf(title: string, lines: string[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text(title, { underline: true });
    doc.moveDown();
    lines.forEach((line) => {
      doc.fontSize(12).text(line);
      doc.moveDown(0.4);
    });

    doc.end();
  });
}
