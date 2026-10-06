import React from 'react';
import { AlertCircle, FileText, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export const ResearchGapCard = ({ gap, index = 0 }) => {
  const supportingPapers = Array.isArray(gap.supportingPapers) ? gap.supportingPapers : [];
  const evidenceCount = gap.evidence || 'Multiple analyzed papers';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition shadow-lg overflow-hidden">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold tracking-wider">
            RESEARCH GAP #{index + 1}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
            {gap.category || 'Empirical Validation'}
          </span>
        </div>

        {/* Badges for trust & provenance */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            Evidence-backed
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3 h-3" />
            AI Interpretation
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Compass className="w-3 h-3" />
            Suggested Direction
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-start gap-2.5 leading-snug">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            {gap.title}
          </h3>
        </div>

        {/* Evidence Stat Box */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Evidence:
          </span>
          <span className="text-xs font-mono font-bold text-amber-200">
            {evidenceCount}
          </span>
          {gap.directEvidence && (
            <span className="text-xs text-slate-400 border-l border-amber-500/20 pl-3 italic">
              "{gap.directEvidence}"
            </span>
          )}
        </div>

        {/* Explanation / Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {gap.explanation || gap.description}
          </p>
        </div>

        {/* Why It Matters */}
        {gap.whyItMatters && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1.5">
              Why it matters
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
              {gap.whyItMatters}
            </p>
          </div>
        )}

        {/* Supporting Papers */}
        {supportingPapers.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Supporting papers ({supportingPapers.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {supportingPapers.map((paperTitle, pIdx) => (
                <div
                  key={pIdx}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {pIdx + 1}
                  </span>
                  <span className="line-clamp-1 font-medium">{paperTitle}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Potential Research Direction */}
        {(gap.potentialResearchDirection || gap.potential_research_direction) && (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              Potential research direction
            </h4>
            <p className="text-sm text-purple-100 leading-relaxed">
              {gap.potentialResearchDirection || gap.potential_research_direction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchGapCard;
