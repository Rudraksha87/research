import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export const ResearchProgress = ({ currentStep = 4, status = 'running' }) => {
  const stages = [
    { label: 'Understanding research question', desc: 'Parsing semantics, domain entities, and core hypotheses' },
    { label: 'Creating search strategy', desc: 'Formulating multi-angle Boolean queries and keywords' },
    { label: 'Searching academic sources', desc: 'Querying Semantic Scholar, arXiv, and Crossref' },
    { label: 'Selecting relevant papers', desc: 'Deduplicating by DOI/title and ranking by semantic relevance' },
    { label: 'Analyzing papers', desc: 'Extracting problem, methodology, dataset, results, and limitations' },
    { label: 'Comparing findings', desc: 'Synthesizing cross-paper comparative matrix and methodology trade-offs' },
    { label: 'Finding research gaps', desc: 'Isolating repeated limitations, missing datasets, and unvalidated areas' },
    { label: 'Generating report', desc: 'Compiling 9-section evidence-backed research report with citations' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2.5">
            {status === 'running' ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            Researching...
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-stage academic investigation pipeline
          </p>
        </div>
        <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full border ${
          status === 'completed'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          {status === 'completed' ? 'All Stages Complete' : `Stage ${Math.min(currentStep + 1, 8)} of 8`}
        </span>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isDone = status === 'completed' || index < currentStep;
          const isCurrent = status === 'running' && index === currentStep;

          return (
            <div
              key={index}
              className={`flex items-start gap-3.5 transition-opacity ${
                isDone || isCurrent ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-700" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCurrent
                    ? 'text-blue-400 font-semibold'
                    : isDone
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}>
                  {isDone ? `✓ ${stage.label}` : isCurrent ? `● ${stage.label}` : `○ ${stage.label}`}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResearchProgress;
