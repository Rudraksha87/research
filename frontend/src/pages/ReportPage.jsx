import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileBarChart, RefreshCw } from 'lucide-react';
import { researchService } from '../services/researchService';
import ReportViewer from '../components/research/ReportViewer';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const ReportPage = () => {
  const { id: projectId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await researchService.getReport(projectId);
      setReport(data);
    } catch (err) {
      setError('Failed to fetch literature report.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [projectId]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Academic Publication</span>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-cyan-400" />
            Synthesized Research Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Publication-ready comprehensive literature survey and benchmark evaluation.
          </p>
        </div>

        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchReport} isLoading={isLoading}>
          Refresh Report
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchReport} />}

      {isLoading ? (
        <LoadingSpinner text="Compiling academic literature synthesis..." />
      ) : (
        <ReportViewer report={report} />
      )}
    </div>
  );
};

export default ReportPage;
