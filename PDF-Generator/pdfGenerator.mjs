import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const generatePDF = async (resumeData) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Use a standard font (Helvetica in this case)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Resume', { x: 50, y: height - 50, font, color: rgb(0, 0, 0) });

    // Add resume data to the PDF
    const content = `Name: ${resumeData.name}\nSkills: ${resumeData.skills}\nExperience: ${resumeData.experience}`;
    page.drawText(content, { x: 50, y: height - 150, font, color: rgb(0, 0, 0) });

    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePDF;