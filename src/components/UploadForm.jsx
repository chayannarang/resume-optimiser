import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, UploadCloud, XCircle } from 'lucide-react';
import { extractTextFromFile } from '../utils/parseFile';
import { countWords, validateCombinedLength } from '../utils/tokenEstimate';

// ── Helper: inline field error ────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-error">
      <AlertTriangle size={12} strokeWidth={1.5} />
      {message}
    </p>
  );
}

// ── Helper: word counter below textarea ───────────────────────────────────────
function TextareaHelper({ text, minChars, maxWords, combinedError }) {
  const chars = text.length;
  const words = countWords(text);
  let hint = null;
  let isError = false;

  if (chars > 0 && chars < minChars) {
    hint = `Too short (min ${minChars} chars)`;
    isError = true;
  } else if (words > maxWords) {
    hint = `Too long — trim to key sections (max ${maxWords} words)`;
    isError = true;
  } else if (combinedError) {
    hint = combinedError;
    isError = true;
  } else if (chars > 0) {
    hint = `${words} word${words !== 1 ? 's' : ''}`;
    isError = false;
  }

  if (!hint) return null;
  return (
    <p className={['mt-1.5 font-body text-xs', isError ? 'text-error' : 'text-text-muted'].join(' ')}>
      {hint}
    </p>
  );
}

// ── Shared input/textarea class builder ───────────────────────────────────────
function fieldClasses(hasError) {
  return [
    'w-full rounded-md border bg-bg-elevated px-4 py-3 font-body text-sm text-text-primary',
    'placeholder:text-text-muted transition-all duration-150 outline-none',
    hasError
      ? 'border-error ring-2 ring-error/10'
      : 'border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent-glow',
  ].join(' ');
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.10em] text-text-secondary">
      {children}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function UploadForm({ mode, onSubmit, preFillCv = '' }) {
  // JD state (W1 only)
  const [jdText, setJdText] = useState('');

  // CV state (both modes)
  const [cvFileName, setCvFileName] = useState('');
  const [cvText, setCvText] = useState(preFillCv);
  const [cvParseError, setCvParseError] = useState(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  // Validation & submission
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear field errors when mode changes
  useEffect(() => {
    setFieldErrors({});
  }, [mode]);

  // ── Derived: canSubmit ──────────────────────────────────────────────────────
  const canSubmit = useMemo(() => {
    if (isSubmitting || isParsingFile) return false;

    const cvOk = cvText.trim().length >= 100 && countWords(cvText) <= 1500;

    if (mode === 'w1') {
      const jdOk = jdText.trim().length >= 150 && countWords(jdText) <= 1500;
      const combinedOk = validateCombinedLength(cvText, jdText).valid;
      return cvOk && jdOk && combinedOk;
    }

    return cvOk; // w2: just needs valid CV
  }, [mode, cvText, jdText, isSubmitting, isParsingFile]);

  // ── Combined length warning (W1 only) ─────────────────────────────────────
  const combinedLengthError = useMemo(() => {
    if (mode !== 'w1' || !cvText || !jdText) return null;
    const { valid, error } = validateCombinedLength(cvText, jdText);
    return valid ? null : error;
  }, [mode, cvText, jdText]);

  // ── File processing ────────────────────────────────────────────────────────
  async function processFile(file) {
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc')) {
      setCvParseError('Only PDF and Word (.docx) files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvParseError('File exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setCvParseError(null);
    setCvFileName(file.name);
    setIsParsingFile(true);
    try {
      const text = await extractTextFromFile(file);
      setCvText(text);
    } catch (err) {
      setCvParseError(err.message);
      setCvFileName('');
    } finally {
      setIsParsingFile(false);
    }
  }

  function clearFile() {
    setCvFileName('');
    setCvText('');
    setCvParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ── Drag-and-drop ──────────────────────────────────────────────────────────
  function onDragEnter(e) {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragActive(true);
  }
  function onDragOver(e) { e.preventDefault(); }
  function onDragLeave() {
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragActive(false);
  }
  function onDrop(e) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    const errors = {};

    if (mode === 'w1') {
      if (jdText.trim().length < 150)
        errors.jdText = 'JD seems too short. Please paste the full job posting.';
      else if (countWords(jdText) > 1500)
        errors.jdText = 'JD is too long. Please trim to key sections.';

      const combined = validateCombinedLength(cvText, jdText);
      if (!combined.valid) errors.combined = combined.error;
    }

    if (cvText.trim().length < 100)
      errors.cvText = 'CV seems too short. Please paste your full CV.';
    else if (countWords(cvText) > 1500)
      errors.cvText = 'CV is too long. Please trim to 2 pages of content.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const payload =
      mode === 'w1'
        ? { mode, cvText: cvText.trim(), jdText: jdText.trim(), cvFileName }
        : { mode, cvText: cvText.trim(), cvFileName };

    onSubmit(payload);
  }

  // ── Upload zone classes ────────────────────────────────────────────────────
  const dropZoneClasses = [
    'relative rounded-md border border-dashed px-6 py-8 text-center transition-all duration-150',
    isDragActive
      ? 'border-accent bg-accent/[0.08]'
      : 'border-border-default bg-bg-elevated hover:border-accent hover:bg-accent/[0.04]',
  ].join(' ');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mt-8 flex flex-col gap-4">

        {/* ── JD Section (W1 only) ──────────────────────────────────────── */}
        {mode === 'w1' && (
          <div>
            <SectionLabel>Job Description</SectionLabel>
            <textarea
              rows={6}
              placeholder="Paste the job posting here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              style={{ minHeight: '120px' }}
              className={`resize-y ${fieldClasses(!!fieldErrors.jdText)}`}
            />
            <FieldError message={fieldErrors.jdText} />
            {!fieldErrors.jdText && (
              <TextareaHelper text={jdText} minChars={150} maxWords={1500} />
            )}
          </div>
        )}

        {/* ── CV Section (both modes) ───────────────────────────────────── */}
        <div>
          <SectionLabel>Your CV</SectionLabel>

          {/* File upload zone */}
          <div
            className={dropZoneClasses}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !cvFileName && fileInputRef.current?.click()}
            style={{ cursor: cvFileName ? 'default' : 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />

            {cvFileName ? (
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xs text-text-secondary">{cvFileName}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="text-text-muted transition-colors hover:text-error"
                  aria-label="Remove file"
                >
                  <XCircle size={16} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={20} strokeWidth={1.5} className="mx-auto mb-2 text-text-muted" />
                <p className="font-body text-sm text-text-secondary">
                  {isParsingFile ? 'Reading file…' : 'Drop your CV here, or click to browse'}
                </p>
                <p className="mt-1 font-body text-xs text-text-muted">PDF or Word · max 5MB</p>
              </>
            )}
          </div>

          {cvParseError && (
            <p className="mt-1.5 flex items-center gap-1 font-body text-xs text-error">
              <AlertTriangle size={12} strokeWidth={1.5} />
              {cvParseError}
            </p>
          )}

          {/* CV textarea */}
          <textarea
            rows={8}
            placeholder="Paste your CV here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            style={{ minHeight: '160px' }}
            className={`mt-3 resize-y ${fieldClasses(!!fieldErrors.cvText)}`}
          />
          <FieldError message={fieldErrors.cvText} />
          {!fieldErrors.cvText && (
            <TextareaHelper
              text={cvText}
              minChars={100}
              maxWords={1500}
              combinedError={combinedLengthError}
            />
          )}
          {fieldErrors.combined && <FieldError message={fieldErrors.combined} />}
        </div>

        {/* ── Submit ───────────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-sm bg-accent px-6 py-3 font-body text-sm font-medium text-white transition-all duration-150 hover:bg-accent-hover hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-muted"
        >
          {isSubmitting
            ? 'Submitting…'
            : mode === 'w1'
            ? 'Tailor My CV'
            : 'Score My CV'}
        </button>

      </div>
    </form>
  );
}
