import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GitCompare, RefreshCw } from 'lucide-react';
import { researchService } from '../services/researchService';
import ComparisonTable from '../components/research/ComparisonTable';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const ComparisonPage = () => {
  const { id: projectId } = useParams();
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComparison = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await researchService.getComparison(projectId);
      setComparison(data);
    } catch (err) {
      setError('Failed to fetch comparative matrix.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-purple-400 tracking-wider">Benchmark Synthesis</span>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-purple-400" />
            Cross-Study Comparison Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tabulated comparison of computational complexity, precision, and hardware affinities.
          </p>
        </div>

        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchComparison} isLoading={isLoading}>
          Refresh Matrix
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchComparison} />}

      {isLoading ? (
        <LoadingSpinner text="Synthesizing multi-dimensional comparison matrix..." />
      ) : (
        <ComparisonTable comparison={comparison} />
      )}
    </div>
  );
};

export default ComparisonPage;
