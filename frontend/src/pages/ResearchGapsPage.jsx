import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, Filter, RefreshCw } from 'lucide-react';
import { researchService } from '../services/researchService';
import ResearchGapCard from '../components/research/ResearchGapCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const ResearchGapsPage = () => {
  const { id: projectId } = useParams();
  const [gaps, setGaps] = useState([]);
  const [impactFilter, setImpactFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGaps = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await researchService.getGaps(projectId);
      setGaps(data || []);
    } catch (err) {
      setError('Failed to fetch research gaps.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [projectId]);

  const filteredGaps = gaps.filter((gap) => {
    if (impactFilter === 'ALL') return true;
    return (gap.impact_level || '').toUpperCase() === impactFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">Literature Blind Spots</span>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Detected Research Gaps ({gaps.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Critical omissions, unexamined edge cases, and contradictory empirical results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchGaps} isLoading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchGaps} />}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Filter className="w-3 h-3" /> Impact:
        </span>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((impact) => (
          <button
            key={impact}
            onClick={() => setImpactFilter(impact)}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
              impactFilter === impact
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {impact}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner text="Scanning literature for empirical vulnerabilities..." />
      ) : filteredGaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGaps.map((gap) => (
            <ResearchGapCard key={gap.id} gap={gap} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No research gaps matched</p>
          <p className="text-xs text-slate-500 mt-1">Execute the pipeline to identify unaddressed questions.</p>
        </div>
      )}
    </div>
  );
};

export default ResearchGapsPage;
