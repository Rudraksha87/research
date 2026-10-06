import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { researchService } from '../services/researchService';
import ResearchInput from '../components/research/ResearchInput';
import ResearchProgress from '../components/research/ResearchProgress';
import ErrorMessage from '../components/common/ErrorMessage';

export const NewResearchPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [progressStep, setProgressStep] = useState(0);
  const navigate = useNavigate();

  const handleStartResearch = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setProgressStep(1);

    try {
      // 1. Create project
      const response = await researchService.createProject({
        title: formData.title,
        query: formData.query,
        domain: formData.domain,
        paperCount: formData.paperCount || 10,
        depth: formData.depth || 'Standard',
        includeSearch: formData.includeSearch
      });

      const projectId = response.project.id;

      // 2. If a seed file was uploaded, upload it
      if (formData.file) {
        setProgressStep(2);
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        uploadData.append('projectId', projectId);
        await researchService.uploadDocument(uploadData);
      }

      // Step progression simulation for immediate UX feedback
      setProgressStep(3);
      setTimeout(() => {
        navigate(`/research/${projectId}`);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize research investigation.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link to="/dashboard" className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Launch Autonomous Research
          </h1>
          <p className="text-xs text-slate-400">
            Formulate hypotheses, search preprints, and synthesize cross-paper benchmarks with Gemini.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isSubmitting ? (
        <div className="py-8 space-y-4">
          <ResearchProgress currentStep={progressStep} status="running" />
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <ResearchInput onSubmit={handleStartResearch} isLoading={isSubmitting} />
        </div>
      )}
    </div>
  );
};

export default NewResearchPage;
