import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

// ── Inline markdown → TextRun array ──────────────────────────────────────────
// Converts **bold** and *italic* markers to styled TextRun objects.
// Matches ** before * so bold takes precedence over italic.
function parseInlineMarkdown(text, baseProps = {}) {
  const runs = [];
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ ...baseProps, text: text.slice(lastIndex, match.index) }));
    }
    if (match[1] !== undefined) {
      // **bold**
      runs.push(new TextRun({ ...baseProps, bold: true, text: match[1] }));
    } else {
      // *italic*
      runs.push(new TextRun({ ...baseProps, italic: true, text: match[2] }));
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ ...baseProps, text: text.slice(lastIndex) }));
  }

  return runs.length > 0 ? runs : [new TextRun({ ...baseProps, text })];
}

const KNOWN_HEADINGS = new Set([
  'KEY SKILLS',
  'PROFESSIONAL SUMMARY',
  'WORK EXPERIENCE',
  'EDUCATION',
  'ADDITIONAL INFORMATION',
  'SKILLS',
  'EXPERIENCE',
  'SUMMARY',
  'CERTIFICATIONS',
  'ACHIEVEMENTS',
  'PROJECTS',
  'REFERENCES',
]);

function classifyLine(line, index) {
  if (index === 0) return 'name';
  const trimmed = line.trim();
  if (!trimmed) return 'empty';
  if (KNOWN_HEADINGS.has(trimmed.toUpperCase())) return 'heading';
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && /[A-Z]/.test(trimmed)) return 'heading';
  return 'body';
}

function buildParagraph(line, type) {
  if (type === 'name') {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: parseInlineMarkdown(line.trim(), { bold: true, size: 56, font: 'Calibri' }),
    });
  }

  if (type === 'heading') {
    return new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: line.trim().toUpperCase(),
          bold: true,
          size: 24, // 12pt
          font: 'Calibri',
        }),
      ],
    });
  }

  // body
  return new Paragraph({
    spacing: { after: 80 },
    children: parseInlineMarkdown(line, { size: 22, font: 'Calibri' }),
  });
}

export async function downloadWord(cvText, filename = 'tailored-cv') {
  const lines = cvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const paragraphs = lines.map((line, i) => {
    const type = classifyLine(line, i);
    if (type === 'empty') {
      return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: '', font: 'Calibri', size: 22 })] });
    }
    return buildParagraph(line, type);
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
