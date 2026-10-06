import React, { useState } from 'react';
import { Sparkles, UploadCloud, Search, CheckCircle2, Sliders, Layers, FileText } from 'lucide-react';
import Button from '../common/Button';

export const ResearchInput = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('How is artificial intelligence being used for crop disease detection?');
  const [title, setTitle] = useState('AI for Crop Disease Detection');
  const [domain, setDomain] = useState('Agriculture & Computer Science');
  const [paperCount, setPaperCount] = useState(10);
  const [depth, setDepth] = useState('Standard');
  const [includeSearch, setIncludeSearch] = useState(true);
  const [file, setFile] = useState(null);

  const sampleTopics = [
    {
      title: 'AI for Crop Disease Detection',
      query: 'How is artificial intelligence being used for crop disease detection?',
      domain: 'Agriculture & Computer Science',
      badge: 'Hackathon Benchmark Demo'
    },
    {
      title: 'State Space Models vs Linear Attention',
      query: 'Empirical comparison of associative recall and inference latency between Mamba and FlashAttention-2 in 100k+ sequence regimes.',
      domain: 'Deep Learning & NLP',
      badge: 'Deep Learning'
    },
    {
      title: 'CRISPR-Cas9 Off-Target Prediction',
      query: 'Evaluating attention-based neural networks for predicting non-homologous gRNA cleavage sites across genomic loci.',
      domain: 'Computational Biology',
      badge: 'Genomics'
    }
  ];

  const handleSelectSample = (sample) => {
    setTitle(sample.title);
    setQuery(sample.query);
    setDomain(sample.domain);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const finalTitle = title.trim() || query.slice(0, 60);
    onSubmit({
      title: finalTitle,
      query: query.trim(),
      domain,
      paperCount: Number(paperCount),
      depth,
      includeSearch,
      file
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hackathon Preset / Quick inspiration chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Research Topic or Demo Question
          </label>
          <span className="text-xs text-emerald-400 font-medium">Recommended for Hackathon Demo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleTopics.map((sample, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className={`text-left p-3.5 rounded-xl border transition text-xs group relative overflow-hidden ${
                query === sample.query
                  ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {sample.badge}
                </span>
                {query === sample.query && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                )}
              </div>
              <p className="font-semibold text-slate-100 group-hover:text-white line-clamp-1 mb-1">
                {sample.title}
              </p>
              <p className="text-slate-400 line-clamp-2 text-[11px]">
                {sample.query}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Research Question Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">
            What do you want to research? <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <textarea
              required
              rows={3}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!title || title === 'AI for Crop Disease Detection') {
                  setTitle(e.target.value.slice(0, 50));
                }
              }}
              placeholder="e.g. How is artificial intelligence being used for crop disease detection?"
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm leading-relaxed"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enter a research question or hypothesis. ResearchLens will search academic literature, extract structured findings, and discover research gaps.
          </p>
        </div>

        {/* Configuration Row: Depth, Number of Papers, Domain */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          {/* Research Depth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Research Depth
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Quick', 'Standard', 'Deep'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    depth === d
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {depth === 'Quick' && 'Fast indexing & primary gap synthesis.'}
              {depth === 'Standard' && 'Balanced cross-paper matrix & gap discovery.'}
              {depth === 'Deep' && 'Exhaustive decomposition across literature.'}
            </p>
          </div>

          {/* Number of Papers */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Number of Papers
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 10, 15].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setPaperCount(count)}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    paperCount === count
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {count} papers
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Default is 10 papers for optimal cross-literature synthesis.
            </p>
          </div>

          {/* Optional Domain */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Research Domain (Optional)
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Agriculture & Computer Science">Agriculture & Computer Science</option>
              <option value="Computer Vision & Multimodal">Computer Vision & Multimodal</option>
              <option value="Deep Learning & NLP">Deep Learning & NLP</option>
              <option value="Computational Biology & Genomics">Computational Biology & Genomics</option>
              <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
              <option value="Biomedical Science">Biomedical Science</option>
              <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
            </select>
          </div>
        </div>

        {/* Optional Seed Document Upload */}
        <div className="border border-dashed border-slate-800 rounded-2xl p-4 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <UploadCloud className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Optional: Upload Research Paper (PDF)</p>
              <p className="text-xs text-slate-500">Attach a manuscript to extract problem, methodology, dataset, results, and limitations</p>
            </div>
          </div>
          <div>
            <label className="cursor-pointer">
              <span className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition inline-block">
                {file ? file.name : 'Select PDF'}
              </span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Searches Semantic Scholar, arXiv & Crossref in real time</span>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={Search}
          className="w-full sm:w-auto px-8"
        >
          Start Research
        </Button>
      </div>
    </form>
  );
};

export default ResearchInput;
