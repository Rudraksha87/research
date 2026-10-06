import React, { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import PaperCard from './PaperCard';

export const PaperList = ({ papers = [], onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.abstract?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'ALL' || paper.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const sources = ['ALL', ...new Set(papers.map(p => p.source).filter(Boolean))];

  return (
    <div className="space-y-5">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search papers by keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Source:
          </span>
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                sourceFilter === src
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onAnalyze={onAnalyze} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No matching papers found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword filter or search queries.</p>
        </div>
      )}
    </div>
  );
};

export default PaperList;
