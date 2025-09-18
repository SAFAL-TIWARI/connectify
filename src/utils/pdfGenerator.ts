import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ProfileData {
  name: string;
  title: string;
  graduationYear: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  currentPosition: string;
  company: string;
  skills: string[];
  education: {
    degree: string;
    university: string;
    gpa: string;
  };
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  achievements?: string[];
}

export const generateResumePDF = async (
  profileData: ProfileData,
  template: string = 'classic'
): Promise<Blob> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Set font
  pdf.setFont('helvetica');

  if (template === 'professional') {
    // Professional Blue Template
    return generateProfessionalTemplate(pdf, profileData, pageWidth, pageHeight, margin);
  } else {
    // Classic Template
    return generateClassicTemplate(pdf, profileData, pageWidth, pageHeight, margin);
  }
};

const generateClassicTemplate = (
  pdf: jsPDF,
  profileData: ProfileData,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Blob => {
  let yPosition = margin;

  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(profileData.name, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(profileData.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Contact Info
  pdf.setFontSize(10);
  const contactInfo = `${profileData.email} | ${profileData.phone} | ${profileData.location}`;
  pdf.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Line separator
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Professional Summary
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const aboutLines = pdf.splitTextToSize(profileData.about, pageWidth - 2 * margin);
  pdf.text(aboutLines, margin, yPosition);
  yPosition += aboutLines.length * 4 + 8;

  // Experience
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXPERIENCE', margin, yPosition);
  yPosition += 8;

  profileData.experience.forEach((exp) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(exp.position, margin, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(exp.duration, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 6;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.text(exp.company, margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const descLines = pdf.splitTextToSize(exp.description, pageWidth - 2 * margin);
    pdf.text(descLines, margin, yPosition);
    yPosition += descLines.length * 4 + 8;
  });

  // Education
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EDUCATION', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(profileData.education.degree, margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(profileData.education.university, margin, yPosition);
  yPosition += 5;

  pdf.setFontSize(10);
  pdf.text(`GPA: ${profileData.education.gpa}`, margin, yPosition);
  yPosition += 10;

  // Skills
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SKILLS', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const skillsText = profileData.skills.join(' • ');
  const skillsLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
  pdf.text(skillsLines, margin, yPosition);

  return pdf.output('blob');
};

const generateProfessionalTemplate = (
  pdf: jsPDF,
  profileData: ProfileData,
  pageWidth: number,
  pageHeight: number,
  margin: number
): Blob => {
  const leftColumnWidth = 60;
  const rightColumnStart = leftColumnWidth + 10;
  const rightColumnWidth = pageWidth - rightColumnStart - margin;

  // Left column background (blue)
  pdf.setFillColor(37, 99, 235); // Blue color
  pdf.rect(0, 0, leftColumnWidth, pageHeight, 'F');

  // Header in left column
  let yPosition = margin;
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  
  // Split name if too long
  const nameLines = pdf.splitTextToSize(profileData.name, leftColumnWidth - 10);
  pdf.text(nameLines, 5, yPosition);
  yPosition += nameLines.length * 6 + 5;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const titleLines = pdf.splitTextToSize(profileData.title, leftColumnWidth - 10);
  pdf.text(titleLines, 5, yPosition);
  yPosition += titleLines.length * 4 + 10;

  // Contact section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CONTACT', 5, yPosition);
  yPosition += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Email:', 5, yPosition);
  yPosition += 4;
  const emailLines = pdf.splitTextToSize(profileData.email, leftColumnWidth - 10);
  pdf.text(emailLines, 5, yPosition);
  yPosition += emailLines.length * 3 + 3;

  pdf.text('Phone:', 5, yPosition);
  yPosition += 4;
  pdf.text(profileData.phone, 5, yPosition);
  yPosition += 6;

  pdf.text('Location:', 5, yPosition);
  yPosition += 4;
  const locationLines = pdf.splitTextToSize(profileData.location, leftColumnWidth - 10);
  pdf.text(locationLines, 5, yPosition);
  yPosition += locationLines.length * 3 + 10;

  // Skills section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SKILLS', 5, yPosition);
  yPosition += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  profileData.skills.slice(0, 8).forEach((skill) => {
    if (yPosition > pageHeight - 20) return;
    pdf.text(`• ${skill}`, 5, yPosition);
    yPosition += 4;
  });
  yPosition += 5;

  // Education section
  if (yPosition < pageHeight - 40) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EDUCATION', 5, yPosition);
    yPosition += 8;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    const degreeLines = pdf.splitTextToSize(profileData.education.degree, leftColumnWidth - 10);
    pdf.text(degreeLines, 5, yPosition);
    yPosition += degreeLines.length * 3 + 2;

    pdf.setFont('helvetica', 'normal');
    const uniLines = pdf.splitTextToSize(profileData.education.university, leftColumnWidth - 10);
    pdf.text(uniLines, 5, yPosition);
    yPosition += uniLines.length * 3 + 2;

    pdf.text(`GPA: ${profileData.education.gpa}`, 5, yPosition);
  }

  // Right column content
  pdf.setTextColor(0, 0, 0); // Black text
  yPosition = margin;

  // Profile section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('PROFILE', rightColumnStart, yPosition);
  
  // Add underline
  pdf.setLineWidth(1);
  pdf.setDrawColor(37, 99, 235);
  pdf.line(rightColumnStart, yPosition + 2, rightColumnStart + 30, yPosition + 2);
  yPosition += 10;

  pdf.setTextColor(0, 0, 0); // Black text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const aboutLines = pdf.splitTextToSize(profileData.about, rightColumnWidth);
  pdf.text(aboutLines, rightColumnStart, yPosition);
  yPosition += aboutLines.length * 4 + 10;

  // Experience section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('EXPERIENCE', rightColumnStart, yPosition);
  
  // Add underline
  pdf.line(rightColumnStart, yPosition + 2, rightColumnStart + 40, yPosition + 2);
  yPosition += 10;

  pdf.setTextColor(0, 0, 0); // Black text
  profileData.experience.forEach((exp) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      // Redraw left column background on new page
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, leftColumnWidth, pageHeight, 'F');
      yPosition = margin;
    }

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(exp.position, rightColumnStart, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(exp.duration, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(37, 99, 235); // Blue color
    pdf.text(exp.company, rightColumnStart, yPosition);
    yPosition += 6;

    pdf.setTextColor(0, 0, 0); // Black text
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const descLines = pdf.splitTextToSize(exp.description, rightColumnWidth);
    pdf.text(descLines, rightColumnStart, yPosition);
    yPosition += descLines.length * 3 + 8;
  });

  return pdf.output('blob');
};

export const downloadPDF = (blob: Blob, filename: string = 'resume.pdf') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateShareableLink = async (profileData: ProfileData): Promise<string> => {
  // In a real application, you would upload the PDF to a cloud service
  // and return a shareable URL. For now, we'll create a data URL
  const pdfBlob = await generateResumePDF(profileData);
  const dataUrl = URL.createObjectURL(pdfBlob);
  
  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(dataUrl);
    return dataUrl;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return dataUrl;
  }
};

export const shareResume = async (profileData: ProfileData): Promise<boolean> => {
  try {
    const pdfBlob = await generateResumePDF(profileData);
    
    if (navigator.share) {
      // Use Web Share API if available
      const file = new File([pdfBlob], `${profileData.name.replace(/\s+/g, '_')}_Resume.pdf`, {
        type: 'application/pdf'
      });
      
      await navigator.share({
        title: `${profileData.name}'s Resume`,
        text: `Check out ${profileData.name}'s professional resume`,
        files: [file]
      });
      return true;
    } else {
      // Fallback: download the file
      downloadPDF(pdfBlob, `${profileData.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      // Copy a shareable message to clipboard
      const shareText = `Check out ${profileData.name}'s professional resume! 
      
Contact: ${profileData.email}
Position: ${profileData.title}
Location: ${profileData.location}`;
      
      await navigator.clipboard.writeText(shareText);
      return true;
    }
  } catch (error) {
    console.error('Error sharing resume:', error);
    return false;
  }
};