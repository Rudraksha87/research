import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Microscope, BookOpen } from 'lucide-react';
import { researchService } from '../services/researchService';
import PaperAnalysis from '../components/research/PaperAnalysis';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const AnalysisPage = () => {
  const { id: projectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      setError('');
      try {
        const paperList = await researchService.getPapers(projectId);
        setPapers(paperList || []);
        if (paperList && paperList.length > 0) {
          setSelectedPaper(paperList[0]);
          loadAnalysis(paperList[0].id);
        }
      } catch (err) {
        setError('Failed to fetch literature for analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitial();
  }, [projectId]);

  const loadAnalysis = async (paperId) => {
    setIsAnalysisLoading(true);
    try {
      const data = await researchService.getAnalysis(paperId);
      setAnalysis(data);
    } catch (err) {
      console.warn('Analysis fetch error:', err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleSelectPaper = (paper) => {
    setSelectedPaper(paper);
    loadAnalysis(paper.id);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading analytical pipeline..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">Deep Deconstruction</span>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Microscope className="w-6 h-6 text-indigo-400" />
          Individual Paper Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Methodological breakdowns, benchmark datasets, empirical strengths, and limitations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Paper selector list */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Paper</p>
          <div className="space-y-1.5">
            {papers.map((p) => {
              const isSelected = selectedPaper?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPaper(p)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/40 text-blue-300 font-semibold shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <p className="line-clamp-2 leading-relaxed">{p.title}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {p.journal_or_venue || 'Preprint'} • {p.year || '2024'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Analysis Content */}
        <div className="lg:col-span-3">
          {isAnalysisLoading ? (
            <div className="p-12 border border-slate-800 rounded-2xl bg-slate-900/40 flex justify-center">
              <LoadingSpinner text="Analyzing paper structure and limitations..." />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <PaperAnalysis analysis={analysis} paperTitle={selectedPaper?.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
