import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ResultsPage from './components/ResultsPage';
import { analyseCV } from './api/analyse';

function normaliseError(err) {
  return {
    type: (err.code ?? 'GENERIC').toLowerCase().replace('_', '-'),
    message: err.message ?? 'Something went wrong. Please try again.',
    retryAfter: err.retryAfter ?? null,
  };
}

export default function App() {
  const [phase, setPhase] = useState('input'); // 'input' | 'loading' | 'results'
  const [mode, setMode] = useState('w2');      // 'w1' | 'w2'
  const [formData, setFormData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  async function runAnalysis(data) {
    try {
      const result = await analyseCV(data);
      setAnalysisResult(result);
      setAnalysisError(null);
    } catch (err) {
      setAnalysisError(normaliseError(err));
      setAnalysisResult(null);
    } finally {
      setPhase('results');
    }
  }

  function handleSubmit(payload) {
    setFormData(payload);
    setAnalysisResult(null);
    setAnalysisError(null);
    setPhase('loading');
    runAnalysis(payload);
  }

  function handleRetry() {
    if (!formData) return;
    setAnalysisError(null);
    setPhase('loading');
    runAnalysis(formData);
  }

  function handleReset() {
    setPhase('input');
    setFormData(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    // mode is preserved intentionally
  }

  function handleSwitchToTailor() {
    const cvText = formData?.cvText ?? '';
    setMode('w1');
    setFormData({ mode: 'w1', cvText, preFilled: true });
    setAnalysisResult(null);
    setAnalysisError(null);
    setPhase('input');
  }

  return (
    <div className="min-h-screen bg-bg-base font-body text-text-primary">
      {phase === 'input' && (
        <LandingPage
          mode={mode}
          onModeChange={setMode}
          onSubmit={handleSubmit}
          preFillCv={formData?.preFilled ? formData.cvText : ''}
        />
      )}

      {phase === 'loading' && (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-subtle border-t-accent" />
          <p className="font-mono text-sm text-text-secondary">Analysing…</p>
        </div>
      )}

      {phase === 'results' && (
        <ResultsPage
          result={analysisResult}
          error={analysisError}
          mode={mode}
          formData={formData}
          onReset={handleReset}
          onRetry={handleRetry}
          onSwitchToTailor={handleSwitchToTailor}
          onTailorAnother={handleSwitchToTailor}
        />
      )}
    </div>
  );
}
