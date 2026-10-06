import React from 'react';
import { Lightbulb, Compass, Zap, ShieldAlert, CheckCircle, Target, HelpCircle } from 'lucide-react';

export const FutureDirectionCard = ({ direction, index = 0 }) => {
  const title = direction.title || direction.proposal_title;
  const problem = direction.problem || 'Unresolved bottleneck identified in current literature';
  const insufficient = direction.whyExistingResearchIsInsufficient || direction.expected_challenges?.[0] || 'Existing models fail to generalize beyond controlled datasets';
  const methodology = direction.possibleMethodology || direction.suggested_methodology || 'Multi-modal experimental framework';
  const contribution = direction.expectedContribution || direction.potential_impact || 'Addresses critical real-world validation gap';

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-500/60 transition shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
            DIRECTION #{index + 1}
          </span>
          <span className="text-[11px] font-medium text-slate-400 italic">
            Prospective Suggestion
          </span>
        </div>

        {direction.feasibility_score && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Feasibility: {direction.feasibility_score}/10
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-100 flex items-start gap-2.5 leading-snug">
        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        {title}
      </h3>

      {/* 1. Problem */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-rose-400" />
          Target Problem
        </p>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {problem}
        </p>
      </div>

      {/* 2. Why existing research is insufficient */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          Why Existing Research Is Insufficient
        </p>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {insufficient}
        </p>
      </div>

      {/* 3. Possible Methodology */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Possible Methodology
        </p>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {methodology}
        </p>
      </div>

      {/* 4. Expected Contribution */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          Expected Contribution
        </p>
        <p className="text-xs text-emerald-100 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
          {contribution}
        </p>
      </div>
    </div>
  );
};

export default FutureDirectionCard;
