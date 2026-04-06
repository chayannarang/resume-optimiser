import { Lock } from 'lucide-react';
import UploadForm from './UploadForm';

const TABS = [
  { id: 'w2', label: 'Score My Resume' },
  { id: 'w1', label: 'Tailor Resume to Job' },
];

export default function LandingPage({ mode, onModeChange, onSubmit, preFillCv }) {
  return (
    <main className="min-h-screen bg-bg-base font-body text-text-primary">
      <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        {/* Header */}
        <header>
          <h1 className="font-display text-4xl font-bold leading-none tracking-tight text-text-primary">
            ResumeOptimiser
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Free AI tool that scores and tailors your resume. Powered by Groq.
          </p>
        </header>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Workflow mode"
          className="mt-8 flex rounded-md bg-bg-surface p-1"
        >
          {TABS.map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onModeChange(tab.id)}
                className={[
                  'flex-1 rounded-sm py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent text-white'
                    : 'bg-transparent text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <UploadForm mode={mode} onSubmit={onSubmit} preFillCv={preFillCv} />

        {/* Privacy Notice */}
        <footer className="mt-10 border-t border-border-subtle pt-4 text-center">
          <Lock
            size={12}
            strokeWidth={1.5}
            className="mr-1.5 inline-block align-middle text-text-muted"
          />
          <span className="font-body text-xs text-text-muted">
            Your data is never stored. Powered by Groq Llama 3.3 70B. All processing happens in real time.
          </span>
        </footer>

      </div>
    </main>
  );
}
