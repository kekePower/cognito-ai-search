import type { jsPDF } from 'jspdf';

export interface PDFGenerationOptions {
  title?: string;
  filename?: string;
  includeTimestamp?: boolean;
  headerText?: string;
}

/**
 * Enhanced PDF generator that converts markdown content to formatted PDF
 */
export class MarkdownPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private maxWidth: number;
  private yPosition: number = 30;
  private inCodeBlock: boolean = false;
  private codeLang: string = '';
  private baseFont: string = 'helvetica';
  private defaultFontSize: number = 11;
  private codeFontSize: number = 10; // Font size for code blocks
  private codeFontColor: [number, number, number] = [60, 60, 60]; // Font color for code blocks
  private codeBlockIndent: number = 10; // Indent for code blocks
  private codeLineHeight: number = this.codeFontSize * 0.352778 * 1.5; // Line height for code blocks
  private lineHeightFactor: number = 1.5; // Increased from 1.2

  constructor(doc: jsPDF) {
    this.doc = doc;
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.maxWidth = this.pageWidth - 2 * this.margin;
  }

  /**
   * Adds page numbers to the bottom of the current page.
   */
  private addPageNumbers(): void {
    const pageCount = (this.doc.internal as any).getNumberOfPages ? (this.doc.internal as any).getNumberOfPages() : 1;
    const currentPage = (this.doc.internal as any).getCurrentPageInfo().pageNumber;
    
    const oldFontSize = this.doc.getFontSize();
    const oldFontStyle = this.doc.getFont().fontStyle;
    const oldFontColor = this.doc.getTextColor();

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(150, 150, 150); // Light gray

    const pageNumText = `Page ${currentPage} of ${pageCount}`;
    const textWidth = this.doc.getTextWidth(pageNumText);
    this.doc.text(pageNumText, this.pageWidth - this.margin - textWidth, this.pageHeight - 10);

    // Restore previous font settings
    this.doc.setFontSize(oldFontSize);
    this.doc.setFont('helvetica', oldFontStyle as any);
    this.doc.setTextColor(oldFontColor);
  }

  /**
   * Check if we need a new page and add one if necessary
   */
  private checkPageBreak(lineHeight: number = 6): void {
    if (this.yPosition + lineHeight > this.pageHeight - this.margin - 15) { // Reserve space for footer
      this.addPageNumbers(); // Add page number to the current page before adding a new one
      this.doc.addPage();
      this.yPosition = this.margin;
      // No need to call addPageNumbers() here for the new page yet, it will be added when this page fills or at save.
    }
  }

  /**
   * Add text with automatic wrapping and page breaks, parsing inline markdown.
   */
  private addText(
    text: string, 
    fontSize: number = this.defaultFontSize, 
    fontNameOrStyle: string = 'normal', // Can be 'normal', 'bold', 'italic', OR a font name like 'courier'
    color: [number, number, number] = [40, 40, 40], 
    lineHeightPoints: number = this.defaultFontSize * this.lineHeightFactor, // Use points for lineHeight
    indent: number = 0
  ): void {
    this.doc.setFontSize(fontSize);
    
    let effectiveFont = this.baseFont;
    let effectiveStyle = 'normal';

    const knownFontNames = ['courier', 'times', 'helvetica']; // Add other specific font names if needed
    const knownStyles = ['normal', 'bold', 'italic', 'bolditalic'];

    if (knownFontNames.includes(fontNameOrStyle.toLowerCase())) {
      effectiveFont = fontNameOrStyle.toLowerCase();
      effectiveStyle = 'normal'; // Assume normal style if a specific font name is given
    } else if (knownStyles.includes(fontNameOrStyle.toLowerCase())) {
      effectiveFont = this.baseFont; // Use baseFont if it's a style
      effectiveStyle = fontNameOrStyle.toLowerCase();
    } else {
      // Default to baseFont and normal style if fontNameOrStyle is unrecognized
      effectiveFont = this.baseFont;
      effectiveStyle = 'normal';
    }

    this.doc.setFont(effectiveFont, effectiveStyle as any); 
    this.doc.setTextColor(...color);
    
    const lineHeightMm = lineHeightPoints * 0.352778;

    const linesToProcess = this.doc.splitTextToSize(text, this.maxWidth - indent);

    linesToProcess.forEach((lineContent: string) => {
      this.checkPageBreak(lineHeightMm); 
      // Pass the determined effectiveFont to parseInlineMarkdown
      this.parseInlineMarkdown(lineContent, fontSize, effectiveFont, color, this.margin + indent);
    });
  }

  /**
   * Method to parse and draw inline markdown elements (bold, italic, code, inline math)
   * This method was accidentally removed and is now being restored.
   */
  private parseInlineMarkdown(
    line: string,
    baseFontSize: number,
    baseFontType: string, // This will be the 'effectiveFont' from addText
    baseColor: [number, number, number],
    currentX: number
  ): number {
    console.log(`[PDFGenerator] parseInlineMarkdown started. Line: "${line.substring(0, 70)}", BaseFont: ${baseFontType}`);
    let remainingLine = line;
    let localX = currentX;
    const pageContentWidth = this.pageWidth - this.margin * 2; // Max width for content on the page

    // Order matters: bold before italic, specific (like $$) before general ($)
    const inlinePatterns = [
      { name: 'bold', regex: /\*\*(.*?)\*\*/g, style: 'bold', font: baseFontType }, // Use baseFontType for bold
      { name: 'italic', regex: /\*(.*?)\*/g, style: 'italic', font: baseFontType }, // Use baseFontType for italic
      { name: 'code', regex: /`(.*?)`/g, style: 'normal', font: 'courier' }, // Code is always courier
      { name: 'math', regex: /\$(.*?)\$/g, style: 'normal', font: 'courier' }, // Inline math is courier
    ];

    let iterationCount = 0;
    const MAX_ITERATIONS = 500; // Safety break

    while (remainingLine.length > 0) {
      iterationCount++;
      if (iterationCount > MAX_ITERATIONS) {
        console.error(`[PDFGenerator] parseInlineMarkdown: Exceeded iteration limit (${MAX_ITERATIONS}) for line: "${line}".`);
        this.doc.setTextColor(255, 0, 0);
        const errorMsg = '[ERR:ITER]';
        this.doc.text(errorMsg, localX, this.yPosition);
        localX += this.doc.getTextWidth(errorMsg);
        break;
      }

      let earliestMatch: {
        index: number;
        length: number;
        text: string;
        pattern: typeof inlinePatterns[0];
      } | null = null;

      for (const pattern of inlinePatterns) {
        pattern.regex.lastIndex = 0; // Reset for global regexes
        const match = pattern.regex.exec(remainingLine);
        if (match && (earliestMatch === null || match.index < earliestMatch.index)) {
          earliestMatch = {
            index: match.index,
            length: match[0].length,
            text: match[1],
            pattern: pattern,
          };
        }
      }

      if (earliestMatch) {
        const beforeText = remainingLine.substring(0, earliestMatch.index);
        if (beforeText) {
          this.doc.setFont(baseFontType, 'normal'); // Use baseFontType for 'before' text
          this.doc.setTextColor(...baseColor);
          this.doc.setFontSize(baseFontSize);
          this.doc.text(beforeText, localX, this.yPosition);
          localX += this.doc.getTextWidth(beforeText);
        }

        const matchedSegmentFont = earliestMatch.pattern.font;
        const matchedSegmentStyle = earliestMatch.pattern.style;
        const matchedText = earliestMatch.text;
        const currentSegmentFontSize = (earliestMatch.pattern.name === 'code' || earliestMatch.pattern.name === 'math') 
                                       ? baseFontSize * 0.9 
                                       : baseFontSize;
        this.doc.setFont(matchedSegmentFont, matchedSegmentStyle as any);
        this.doc.setTextColor(...baseColor);
        this.doc.setFontSize(currentSegmentFontSize);
        this.doc.text(matchedText, localX, this.yPosition);
        localX += this.doc.getTextWidth(matchedText);
        
        remainingLine = remainingLine.substring(earliestMatch.index + earliestMatch.length);
      } else {
        // No more patterns match, print the rest of the line with baseFontType
        this.doc.setFont(baseFontType, 'normal');
        this.doc.setTextColor(...baseColor);
        this.doc.setFontSize(baseFontSize);
        this.doc.text(remainingLine, localX, this.yPosition);
        localX += this.doc.getTextWidth(remainingLine);
        remainingLine = '';
      }
    }
    // After processing the entire logical line, advance yPosition
    this.yPosition += baseFontSize * 0.352778 * this.lineHeightFactor;
    return localX;
  }

  /**
   * Extract title from markdown content
   */
  private extractTitle(text: string): string {
    // Look for markdown headers first
    const headerMatch = text.match(/^#\s+(.+)$/m);
    if (headerMatch) {
      return headerMatch[1].trim();
    }
    
    // Look for lines that look like titles (short, descriptive)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // If first line is reasonable length for a title (not too long)
      if (firstLine.length <= 80 && !firstLine.includes('.') && !firstLine.startsWith('*')) {
        return firstLine;
      }
    }
    
    // Fallback to first few words
    const words = text.trim().split(/\s+/).slice(0, 5);
    return words.join(' ');
  }

  /**
   * Create safe filename from title
   */
  private createSafeFilename(title: string, prefix: string = 'cognito-ai-search'): string {
    // Remove markdown formatting and special characters
    const cleanTitle = title
      .replace(/[#*_`]/g, '') // Remove markdown
      .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()
      .substring(0, 50); // Limit length
    
    return `${prefix}-${cleanTitle}.pdf`;
  }

  /**
   * Parse and format markdown content
   */
  private parseMarkdown(text: string): void {
    console.log('[PDFGenerator] parseMarkdown called. Text length:', text.length); // Log entry
    const lines = text.split('\n');
    let inMathBlock = false;
    let currentMathBlock: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      try {
        this.checkPageBreak();

        // Handle display math blocks ($$...$$)
        if (line.trim() === '$$') {
          if (inMathBlock) {
            // End of math block
            inMathBlock = false;
            console.log('[PDFGenerator] Math block END detected.');
            if (currentMathBlock.length > 0) {
              const mathContent = currentMathBlock.join('\n'); 
              console.log(`[PDFGenerator] Processing Math Block Content: ${mathContent.substring(0,100)}`);
              // Render the math content
              this.addText(mathContent, this.codeFontSize, 'courier', this.codeFontColor, this.codeFontSize * this.lineHeightFactor, this.codeBlockIndent);
            }
            currentMathBlock = [];
            // Add space after the math block (half a standard line height)
            this.yPosition += (this.defaultFontSize * 0.352778 * this.lineHeightFactor) * 0.5;
            this.checkPageBreak();
          } else {
            // Start of math block
            inMathBlock = true;
            console.log('[PDFGenerator] Math block START detected.');
            // Add space before the math block (half a standard line height)
            this.yPosition += (this.defaultFontSize * 0.352778 * this.lineHeightFactor) * 0.5;
            this.checkPageBreak();
          }
        } else if (inMathBlock) {
          currentMathBlock.push(line);
        } else if (line.match(/^```(.*)/)) {
          if (this.inCodeBlock) {
            this.inCodeBlock = false;
            this.codeLang = '';
            this.yPosition += this.codeLineHeight / 2; // Space after code block
            this.checkPageBreak();
          } else {
            this.inCodeBlock = true;
            this.codeLang = line.match(/^```(.*)/)?.[1]?.trim() || '';
            this.yPosition += this.codeLineHeight / 2; // Space before code block
            this.checkPageBreak();
            // Optionally, draw a background or border for the code block here
          }
        } else if (this.inCodeBlock) {
          this.checkPageBreak(this.codeFontSize * 0.352778 * this.lineHeightFactor);
          this.addText(line, this.codeFontSize, 'normal', this.codeFontColor, this.codeFontSize * this.lineHeightFactor, this.codeBlockIndent);
        } else {
          // Handle other markdown elements
          if (line.match(/^#{1}\s+/)) {
            // H1 - Main heading
            const text = line.replace(/^#{1}\s+/, '').trim();
            this.yPosition += 8; // Extra space before heading
            this.addText(text, 18, 'bold', [0, 100, 200], 12); // Base style is 'bold'
            this.yPosition += 4; // Extra space after heading
        
          } else if (line.match(/^#{2}\s+/)) {
            // H2 - Secondary heading
            const text = line.replace(/^#{2}\s+/, '').trim();
            this.yPosition += 6;
            this.addText(text, 14, 'bold', [0, 120, 180], 10); // Base style is 'bold'
            this.yPosition += 3;
        
          } else if (line.match(/^#{3}\s+/)) {
            // H3 - Tertiary heading
            const text = line.replace(/^#{3}\s+/, '').trim();
            this.yPosition += 4;
            this.addText(text, 12, 'bold', [0, 140, 160], 8); // Base style is 'bold'
            this.yPosition += 2;
        
          } else if (line.match(/^(\*{3}\s*|---|___)\s*$/)) { // Horizontal Rule
            this.checkPageBreak(10);
            this.yPosition += 5; // Space before HR
            this.doc.setLineWidth(0.2);
            this.doc.setDrawColor(200, 200, 200);
            this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
            this.yPosition += 5; // Space after HR

          } else if (line.match(/^\s*[-*+]\s+/)) {
            // Bullet points
            const text = line.replace(/^\s*[-*+]\s+/, '').trim();
            this.addText(`• ${text}`, 11, 'normal', [60, 60, 60], 7, 10);
        
          } else if (line.match(/^\s*\d+\.\s+/)) {
            // Numbered lists
            const rawTextContent = line.replace(/^\s*\d+\.\s+/, '').trim();
            const numberMatch = line.match(/^\s*(\d+)\./);
            const number = numberMatch ? numberMatch[1] : '1';
            // Pass rawTextContent (which might contain **bold**) to addText
            this.addText(`${number}. ${rawTextContent}`, 11, 'normal', [60, 60, 60], 7, 15);
        
          } else if (line.match(/^>\s+/)) {
            // Blockquotes - enhanced styling
            const bqText = line.replace(/^>\s+/, '').trim();
            this.checkPageBreak(7 + 4); // Line height + padding
            const bqIndent = 10;
            const bqWidth = this.maxWidth - bqIndent - 5; // 5 for right padding

            // Draw left border for blockquote
            this.doc.setDrawColor(200, 200, 200); // Light gray border
            this.doc.setLineWidth(0.5);
            const startY = this.yPosition;
        
            // Add text for blockquote (will handle its own yPosition increment)
            // Store current yPosition to calculate height of blockquote text
            const yPosBeforeBqText = this.yPosition;
            this.addText(bqText, 10, 'italic', [100, 100, 100], 6, bqIndent + 5); // Indent text within quote
            const yPosAfterBqText = this.yPosition;

            // Draw the line after text has been added and yPosition updated
            this.doc.line(this.margin + bqIndent / 2, startY - 2, this.margin + bqIndent / 2, yPosAfterBqText - 6 + 2);
            this.yPosition += 2; // Extra space after blockquote
        
          } else if (line.trim() === '') {
            // Empty lines - add spacing
            this.yPosition += 3;
        
          } else if (line.trim()) {
            // Regular text with inline formatting cleanup
            this.addText(line, this.defaultFontSize, 'normal', [40, 40, 40], this.defaultFontSize * this.lineHeightFactor);
          }
        }
      } catch (error) {
        console.error(`Error processing Markdown line ${i + 1}: "${line}"`, error);
        // Optionally, re-throw the error if you want to halt further processing
        // or add special handling, like skipping the line or adding an error message to the PDF.
        // For now, we'll log and continue, which might result in a partially generated PDF.
        this.addText(`[Error processing line: ${line.substring(0, 50)}...]`, 10, 'italic', [255, 0, 0]);
      }
    }
  }

  /**
   * Adds header content like title, header text, and timestamp.
   * @returns true if any content was added, false otherwise.
   */
  private addHeader(options: PDFGenerationOptions & { title?: string }): boolean {
    const { title, includeTimestamp, headerText } = options;
    let currentY = this.yPosition;
    let contentAdded = false;

    if (headerText) {
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 80, 150); // Dark blue
      const headerWidth = this.doc.getTextWidth(headerText);
      this.doc.text(headerText, (this.pageWidth - headerWidth) / 2, currentY);
      currentY += 10; // Space after header text
      contentAdded = true;
    } else if (title && !headerText) { // Fallback to title if no specific headerText
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 80, 150); // Dark blue
      const titleWidth = this.doc.getTextWidth(title);
      this.doc.text(title, (this.pageWidth - titleWidth) / 2, currentY);
      currentY += 10; // Space after title
      contentAdded = true;
    }

    if (includeTimestamp) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(120, 120, 120); // Gray
      const timestamp = `Generated: ${new Date().toLocaleString()}`;
      const timestampWidth = this.doc.getTextWidth(timestamp);
      const timestampX = (this.pageWidth - timestampWidth) / 2;
      this.doc.text(timestamp, timestampX, currentY);
      currentY += 7; // Space after timestamp text itself
      contentAdded = true; // Timestamp itself is content
    }

    if (contentAdded) {
      currentY += 5; // Add 5 units of padding if any header content was rendered
      this.yPosition = currentY; // Update main yPosition
    }
    return contentAdded;
  }
  
  /**
   * Generate PDF from markdown content
   */
  public async generatePDF(
    markdownContent: string,
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    console.log('[PDFGenerator] generatePDF called. Options:', options, 'Content length:', markdownContent.length); // Log entry
    try {
      // Extract title if not provided
      const title = options.title || this.extractTitle(markdownContent);
      const filename = options.filename || this.createSafeFilename(title);
      
      // Add header - this updates this.yPosition if content is added
      const headerContentRendered = this.addHeader({ ...options, title });

      if (headerContentRendered) {
        // If header (title/headerText/timestamp) was rendered, add a separator line
        this.doc.setLineWidth(0.2);
        this.doc.setDrawColor(180, 180, 180);
        this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
        this.yPosition += 8; // Space AFTER this line, before markdown content
      } else {
        // No header content was rendered by addHeader.
        // Add a small default top margin for the content if no header at all.
        this.yPosition += 5; 
      }
      
      // Parse and add markdown content
      this.parseMarkdown(markdownContent);
      
      // Add page numbers to the last page
      this.addPageNumbers();

      // Save the PDF
      this.doc.save(filename);
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw new Error('PDF generation failed');
    }
  }
}

/**
 * Convenience function to generate PDF from markdown
 */
export async function generateMarkdownPDF(
  markdownContent: string,
  options: PDFGenerationOptions = {},
  docInstance?: jsPDF // Optional: pass an existing jsPDF instance
): Promise<void> {
  // Dynamic import to ensure jsPDF is only loaded when needed
  const jsPDF = (await import('jspdf')).default;
  const doc = docInstance || new jsPDF();
  const generator = new MarkdownPDFGenerator(doc);
  await generator.generatePDF(markdownContent, options);
}
