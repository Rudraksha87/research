import React from 'react';
import { ExternalLink, Star, Sparkles, Quote, BookOpen } from 'lucide-react';
import { formatAuthors, truncateText } from '../../utils/formatResearch';
import Button from '../common/Button';

export const PaperCard = ({ paper, onAnalyze }) => {
  const paperLink = paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : null);
  const citationCount = typeof paper.citation_count === 'number'
    ? paper.citation_count
    : typeof paper.citationCount === 'number'
    ? paper.citationCount
    : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Badges / Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {paper.source || 'Academic'}
            </span>
            <span className="text-xs text-slate-400">
              {paper.year || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {citationCount > 0 && (
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Quote className="w-3 h-3 text-slate-500" />
                {citationCount} citations
              </span>
            )}
            {paper.score && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Score: {paper.score}
              </span>
            )}
          </div>
        </div>

        {/* Paper Title */}
        <h3 className="text-base font-bold text-slate-100 hover:text-blue-400 transition leading-snug">
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-xs text-slate-400 font-medium">
          {formatAuthors(paper.authors)}
        </p>

        {/* Abstract */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {truncateText(paper.abstract || 'No abstract available for this publication.', 260)}
        </p>
      </div>

      {/* Action Buttons: [ View Paper ] and [ Analyze ] */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {paperLink ? (
          <a
            href={paperLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            View Paper
          </a>
        ) : (
          <span className="text-xs text-slate-500 italic">Local Preprint</span>
        )}

        <Button
          size="sm"
          variant="outline"
          icon={Sparkles}
          onClick={() => onAnalyze && onAnalyze(paper)}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default PaperCard;
