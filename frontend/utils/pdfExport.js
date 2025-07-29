/**
 * PDF Export Utility
 * 
 * Provides functionality to export articles as PDF documents with
 * proper formatting, metadata, and content organization.
 */

import jsPDF from 'jspdf';

/**
 * Export an article as a PDF document
 * Creates a formatted PDF with title, metadata, content, and optional summary
 * @param {Object} article - Article object containing title, content, metadata, and summary
 */
export function exportArticleAsPDF(article) {
  // Initialize PDF document
  const doc = new jsPDF();
  
  // Configure document styling
  doc.setFont('helvetica');
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // Dark blue-gray color
  
  // Add Knowledge Hub branding
  doc.text('Knowledge Hub', 20, 20);
  
  // Article title with larger, bold font
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(article.title, 20, 40);
  
  // Article metadata (creation date)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100); // Gray color for metadata
  doc.text(`Created: ${new Date(article.createdAt).toLocaleDateString()}`, 20, 55);
  
  // Article tags (if available)
  if (article.tags && article.tags.length > 0) {
    doc.setTextColor(74, 172, 255); // Blue color for tags
    doc.text(`Tags: ${article.tags.join(', ')}`, 20, 65);
  }
  
  // Main content formatting
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80); // Dark color for content
  doc.setFont('helvetica', 'normal');
  
  // Split content into lines that fit the page width
  const maxWidth = 170; // Page width minus margins
  const lines = doc.splitTextToSize(article.content, maxWidth);
  
  let yPosition = 80;
  const lineHeight = 7;
  
  // Add content lines with automatic page breaks
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(lines[i], 20, yPosition);
    yPosition += lineHeight;
  }
  
  // Add AI-generated summary (if available)
  if (article.summary) {
    yPosition += 10; // Add spacing before summary
    
    // Check if we need a new page for summary
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Summary title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Summary:', 20, yPosition);
    
    yPosition += 10;
    
    // Summary content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100); // Gray color for summary
    
    const summaryLines = doc.splitTextToSize(article.summary, maxWidth);
    for (let i = 0; i < summaryLines.length; i++) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(summaryLines[i], 20, yPosition);
      yPosition += lineHeight;
    }
  }
  
  // Add footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150); // Light gray for footer
    doc.text(`Page ${i} of ${pageCount}`, 20, 290);
    doc.text(`Generated from Knowledge Hub`, 120, 290);
  }
  
  // Generate filename and save PDF
  const filename = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
} 