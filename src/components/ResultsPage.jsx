import { useState } from 'react';
import { CheckCircle2, TrendingUp, AlertCircle, ChevronRight, Clipboard, Download } from 'lucide-react';
import { rewriteCV } from '../api/analyse';
import { downloadWord } from '../utils/downloadWord';

// ── Score color by band ───────────────────────────────────────────────────────
function scoreColor(n) {
  if (n >= 75) return '#22C55E';
  if (n >= 50) return '#F59E0B';
  return '#EF4444';
}

function scoreBg(n) {
  if (n >= 75) return 'rgba(34,197,94,0.10)';
  if (n >= 50) return 'rgba(245,158,11,0.10)';
  return 'rgba(239,68,68,0.10)';
}

function scoreLabel(n) {
  if (n >= 75) return 'Strong';
  if (n >= 50) return 'Good Start';
  return 'Needs Work';
}

// ── Single score card ─────────────────────────────────────────────────────────
function ScoreCard({ label, score }) {
  const color = scoreColor(score);
  const bg = scoreBg(score);

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface"
      style={{ minWidth: 0 }}
    >
      {/* Body */}
      <div className="flex flex-1 flex-col px-6 pt-6 pb-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.10em] text-text-secondary">
          {label}
        </p>

        {/* Big number */}
        <div className="mt-3 flex items-baseline gap-1">
          <span
            className="font-mono text-5xl font-bold leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="font-mono text-lg text-text-muted">/100</span>
        </div>

        {/* Band label pill */}
        <div className="mt-3">
          <span
            className="rounded-sm px-2 py-1 font-body text-xs font-medium"
            style={{ color, background: bg }}
          >
            {scoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-bg-elevated">
        <div
          className="h-full rounded-none transition-all duration-700 ease-out"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ResultsPage({ result, error, mode, onReset, onRetry, onSwitchToTailor, formData, onTailorAnother }) {
  const isW2 = mode === 'w2';

  // Rewrite state (W1 only)
  const [rewrittenCv, setRewrittenCv]   = useState(null);
  const [isRewriting, setIsRewriting]   = useState(false);
  const [rewriteError, setRewriteError] = useState(null);
  const [copied, setCopied]             = useState(false);

  async function handleGenerateRewrite() {
    setIsRewriting(true);
    setRewriteError(null);
    try {
      const data = await rewriteCV({ jdText: formData?.jdText ?? '', cvText: formData?.cvText ?? '' });
      setRewrittenCv(data.rewrittenCv);
    } catch (err) {
      setRewriteError(err.message ?? 'Failed to generate rewrite. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  }

  function handleCopy() {
    if (!rewrittenCv) return;
    navigator.clipboard.writeText(rewrittenCv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!rewrittenCv) return;
const raw = formData?.cvFileName ?? '';
    const base = raw ? raw.replace(/\.[^.]+$/, '').replace(/^Tailored_/i, '') : '';
    const filename = base ? `Tailored_${base}` : 'Tailored_CV';
    downloadWord(rewrittenCv, filename);
  }

  return (
    <div className="min-h-screen bg-bg-base font-body text-text-primary">
      <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* ── Error state ─────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-md border border-error/30 bg-error-bg p-5">
            <p className="font-body text-sm text-error">{error.message}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={onRetry}
                className="rounded-sm border border-error/40 bg-transparent px-4 py-2 text-sm text-error transition-colors hover:border-error"
              >
                Try Again
              </button>
              <button
                onClick={onReset}
                className="rounded-sm border border-border-default bg-transparent px-4 py-2 text-sm text-text-secondary transition-colors hover:border-border-active"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {result && (
          <div className="flex flex-col gap-8">

            {/* 1 · Score cards */}
            <div className="flex gap-4 sm:gap-6">
              <ScoreCard label="Formatting Score" score={result.formattingScore} />
              {isW2
                ? <ScoreCard label="Clarity & Impact" score={result.clarityScore} />
                : <ScoreCard label="Keyword Score"    score={result.keywordScore} />
              }
            </div>

            {/* 2 · W2: Strengths + Improvements | W1: What Changed */}
            {isW2 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Strengths */}
                {Array.isArray(result.strengths) && result.strengths.length > 0 && (
                  <section className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle">
                      <TrendingUp size={13} strokeWidth={2} className="text-score-green shrink-0" />
                      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.10em] text-score-green">
                        What's Working
                      </h2>
                    </div>
                    {result.strengths.map((item, i) => (
                      <div
                        key={i}
                        className={[
                          'flex items-start gap-3 px-5 py-3.5',
                          i < result.strengths.length - 1 ? 'border-b border-border-subtle' : '',
                        ].join(' ')}
                      >
                        <CheckCircle2 size={14} strokeWidth={1.75} className="mt-px shrink-0 text-score-green" />
                        <p className="font-body text-sm leading-relaxed text-text-primary">{item}</p>
                      </div>
                    ))}
                  </section>
                )}

                {/* Improvements */}
                {Array.isArray(result.improvements) && result.improvements.length > 0 && (
                  <section className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle">
                      <AlertCircle size={13} strokeWidth={2} className="text-score-amber shrink-0" />
                      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.10em] text-score-amber">
                        What to Improve
                      </h2>
                    </div>
                    {result.improvements.map((item, i) => (
                      <div
                        key={i}
                        className={[
                          'flex items-start gap-3 px-5 py-3.5',
                          i < result.improvements.length - 1 ? 'border-b border-border-subtle' : '',
                        ].join(' ')}
                      >
                        <AlertCircle size={14} strokeWidth={1.75} className="mt-px shrink-0 text-score-amber" />
                        <p className="font-body text-sm leading-relaxed text-text-primary">{item}</p>
                      </div>
                    ))}
                  </section>
                )}

              </div>
            ) : (
              /* W1: What Changed */
              Array.isArray(result.whatChanged) && result.whatChanged.length > 0 && (
                <section className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle">
                    <ChevronRight size={13} strokeWidth={2} className="text-accent shrink-0" />
                    <h2 className="font-display text-xs font-semibold uppercase tracking-[0.10em] text-accent">
                      What to Change
                    </h2>
                  </div>
                  {result.whatChanged.map((item, i) => (
                    <div
                      key={i}
                      className={[
                        'flex items-start gap-3 px-5 py-3.5',
                        i < result.whatChanged.length - 1 ? 'border-b border-border-subtle' : '',
                      ].join(' ')}
                    >
                      <ChevronRight size={14} strokeWidth={1.75} className="mt-px shrink-0 text-accent" />
                      <p className="font-body text-sm leading-relaxed text-text-primary">{item}</p>
                    </div>
                  ))}
                </section>
              )
            )}

            {/* 3 · W1: Generate Tailored CV */}
            {!isW2 && !rewrittenCv && (
              <div>
                <button
                  onClick={handleGenerateRewrite}
                  disabled={isRewriting}
                  className="w-full rounded-sm bg-accent px-6 py-3 font-body text-sm font-medium text-white transition-all duration-150 hover:bg-accent-hover hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-muted"
                >
                  {isRewriting ? 'Generating…' : 'Generate Tailored CV'}
                </button>
                {rewriteError && (
                  <div className="mt-3 rounded-md border border-error/30 bg-error-bg p-4">
                    <p className="font-body text-sm text-error">{rewriteError}</p>
                    <button
                      onClick={handleGenerateRewrite}
                      className="mt-2 font-body text-xs text-error underline hover:no-underline"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4 · W1: Rewritten CV display */}
            {!isW2 && rewrittenCv && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-xs font-semibold uppercase tracking-[0.10em] text-text-secondary">
                    Your Tailored CV
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-sm border border-border-default px-3 py-1.5 font-body text-xs text-text-secondary transition-colors hover:border-border-active hover:text-text-primary"
                    >
                      <Clipboard size={12} strokeWidth={1.75} />
                      {copied ? 'Copied ✓' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 rounded-sm border border-border-default px-3 py-1.5 font-body text-xs text-text-secondary transition-colors hover:border-border-active hover:text-text-primary"
                    >
                      <Download size={12} strokeWidth={1.75} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-surface">
                  <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words px-6 py-5 font-body text-sm leading-relaxed text-text-primary">
                    {rewrittenCv}
                  </pre>
                </div>
              </section>
            )}

            {/* 5 · Footer actions */}
            {isW2 ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={onSwitchToTailor}
                  className="w-full rounded-sm bg-accent py-3 font-body text-sm font-medium text-white transition-all duration-150 hover:bg-accent-hover hover:-translate-y-px active:translate-y-0"
                >
                  Tailor CV to JD →
                </button>
                <button
                  onClick={onReset}
                  className="w-full rounded-sm border border-accent bg-transparent py-3 font-body text-sm font-medium text-accent transition-all duration-150 hover:bg-accent/[0.06] hover:-translate-y-px active:translate-y-0"
                >
                  Score a Different CV
                </button>
              </div>
            ) : rewrittenCv ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={onTailorAnother}
                  className="w-full rounded-sm bg-accent py-3 font-body text-sm font-medium text-white transition-all duration-150 hover:bg-accent-hover hover:-translate-y-px active:translate-y-0"
                >
                  Tailor for Another Job
                </button>
                <button
                  onClick={onReset}
                  className="w-full rounded-sm border border-accent bg-transparent py-3 font-body text-sm font-medium text-accent transition-all duration-150 hover:bg-accent/[0.06] hover:-translate-y-px active:translate-y-0"
                >
                  Start Fresh
                </button>
              </div>
            ) : (
              <button
                onClick={onReset}
                className="w-full rounded-sm border border-border-default bg-transparent py-3 font-body text-sm font-medium text-text-secondary transition-all duration-150 hover:border-border-active hover:text-text-primary hover:-translate-y-px active:translate-y-0"
              >
                Start Over
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
