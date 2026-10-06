import React from 'react';
import { Target, Lightbulb, Search, CheckCircle, Tag } from 'lucide-react';
import { getStatusBadge } from '../../utils/formatResearch';

export const ResearchSummary = ({ project }) => {
  if (!project) return null;

  const status = getStatusBadge(project.status);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
              {project.domain || 'General Science'}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{project.title}</h2>
        </div>
      </div>

      {/* Query & Hypothesis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            Core Research Query
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{project.query}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4" />
            Operational Hypothesis
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {project.plan?.hypothesis || 'Hypothesis formulation established by Gemini literature analyzer.'}
          </p>
        </div>
      </div>

      {/* Target Metrics & Search Queries */}
      {project.plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.plan.targetMetrics && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Target Metrics</h4>
              <div className="flex flex-wrap gap-2">
                {project.plan.targetMetrics.map((metric, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.plan.searchQueries && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Search Vectors</h4>
              <div className="flex flex-wrap gap-2">
                {project.plan.searchQueries.map((query, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Search className="w-3 h-3 text-slate-500" />
                    {query}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Findings */}
      {project.key_findings && project.key_findings.length > 0 && (
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Key Synthesis Findings</h4>
          <ul className="space-y-2">
            {project.key_findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResearchSummary;
