import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, PlusCircle, RefreshCw } from 'lucide-react';
import { researchService } from '../services/researchService';
import PaperList from '../components/research/PaperList';
import PaperAnalysis from '../components/research/PaperAnalysis';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export const PapersPage = () => {
  const { id: projectId } = useParams();
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected paper for deep analysis modal
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [paperAnalysis, setPaperAnalysis] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // Manual Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());

  const fetchPapers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await researchService.getPapers(projectId);
      setPapers(data || []);
    } catch (err) {
      setError('Failed to fetch indexed papers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [projectId]);

  const handleOpenAnalysis = async (paper) => {
    setSelectedPaper(paper);
    setIsAnalysisLoading(true);
    try {
      const analysis = await researchService.getAnalysis(paper.id);
      setPaperAnalysis(analysis);
    } catch (err) {
      console.warn('Failed to load analysis:', err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await researchService.addPaper({
        projectId,
        title: newTitle,
        authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
        abstract: newAbstract,
        year: Number(newYear)
      });
      setPapers(prev => [created, ...prev]);
      setIsAddOpen(false);
      setNewTitle('');
      setNewAuthors('');
      setNewAbstract('');
    } catch (err) {
      alert('Failed to add paper citation.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">Literature Corpus</span>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Indexed Academic Papers ({papers.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked and deduplicated literature retrieved for this investigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchPapers} isLoading={isLoading}>
            Refresh
          </Button>
          <Button size="sm" variant="primary" icon={PlusCircle} onClick={() => setIsAddOpen(true)}>
            Add Paper
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPapers} />}

      {isLoading ? (
        <LoadingSpinner text="Retrieving academic citations..." />
      ) : (
        <PaperList papers={papers} onAnalyze={handleOpenAnalysis} />
      )}

      {/* Deep Analysis Modal */}
      <Modal
        isOpen={!!selectedPaper}
        onClose={() => setSelectedPaper(null)}
        title="Deep Paper Analysis"
        maxWidth="max-w-3xl"
      >
        {isAnalysisLoading ? (
          <LoadingSpinner text="Deconstructing paper methodology with Gemini..." />
        ) : (
          <PaperAnalysis analysis={paperAnalysis} paperTitle={selectedPaper?.title} />
        )}
      </Modal>

      {/* Manual Add Paper Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Paper to Investigation"
      >
        <form onSubmit={handleAddPaper} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Paper Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Attention Is All You Need"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Authors (comma separated)</label>
            <input
              type="text"
              value={newAuthors}
              onChange={(e) => setNewAuthors(e.target.value)}
              placeholder="Ashish Vaswani, Noam Shazeer, Niki Parmar"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Publication Year</label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Abstract</label>
            <textarea
              rows={4}
              value={newAbstract}
              onChange={(e) => setNewAbstract(e.target.value)}
              placeholder="Paste abstract here..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Paper
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PapersPage;
