import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { researchService } from '../services/researchService';
import FutureDirectionCard from '../components/research/FutureDirectionCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const FutureResearchPage = () => {
  const { id: projectId } = useParams();
  const [directions, setDirections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDirections = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await researchService.getFutureDirections(projectId);
      setDirections(data || []);
    } catch (err) {
      setError('Failed to fetch future research proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDirections();
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">Strategic Roadmap</span>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-emerald-400" />
            Future Directions & Research Proposals
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Novel, actionable experimental methodologies designed to address identified research gaps.
          </p>
        </div>

        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchDirections} isLoading={isLoading}>
          Refresh Proposals
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDirections} />}

      {isLoading ? (
        <LoadingSpinner text="Formulating next-generation project proposals..." />
      ) : directions.length > 0 ? (
        <div className="space-y-4">
          {directions.map((direction) => (
            <FutureDirectionCard key={direction.id} direction={direction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Lightbulb className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No proposals formulated yet</p>
          <p className="text-xs text-slate-500 mt-1">Execute the research pipeline to generate future directions.</p>
        </div>
      )}
    </div>
  );
};

export default FutureResearchPage;
