import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  Microscope,
  GitCompare,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleViewDemo = async () => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    try {
      await login('dr.alex@researchlens.ai', 'Password123!');
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    }
  };

  const workflowSteps = [
    {
      step: '1',
      title: 'Search',
      desc: 'Retrieves papers from Semantic Scholar, arXiv, and Crossref',
      icon: Search,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      step: '2',
      title: 'Analyze',
      desc: 'Extracts methodology, datasets, findings, and limitations',
      icon: Microscope,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      step: '3',
      title: 'Compare',
      desc: 'Synthesizes cross-paper matrices and empirical trade-offs',
      icon: GitCompare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      step: '4',
      title: 'Discover Gaps',
      desc: 'Identifies repeated limitations, missing datasets, and open problems',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    }
  ];

  return (
    <div className="relative overflow-hidden pt-4 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section (Section 18) */}
      <div className="text-center pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Challenge: AI for Research & Knowledge Discovery</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-blue-400 mb-3">
          ResearchLens
        </h2>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Discover what research already knows.<br />
          <span className="bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
            Find what it doesn't.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI-powered research agent that searches academic literature, analyzes research, compares findings, and discovers research gaps.
        </p>

        {/* Buttons: [ Start Research ] and [ View Demo ] */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={user ? '/research' : '/register'}>
            <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto px-8">
              Start Research
            </Button>
          </Link>
          <Button size="lg" variant="secondary" onClick={handleViewDemo} className="w-full sm:w-auto px-8">
            View Demo
          </Button>
        </div>

        {/* Real Benchmark Teaser */}
        <div className="mt-8 p-3 rounded-xl bg-slate-900/60 border border-slate-800 inline-flex items-center gap-2 text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">Demo Scenario:</span>
          <span>"How is artificial intelligence being used for crop disease detection?"</span>
        </div>
      </div>

      {/* Simple Workflow (Section 18: Search → Analyze → Compare → Discover Gaps) */}
      <div className="py-12 border-t border-slate-800/80">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            How ResearchLens Works
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">
            Autonomous Literature Investigation Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.border} border flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block text-slate-700 text-right">
                    <span className="text-sm">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Differentiator Callout: Research Gap Discovery */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>The Main Differentiator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Research Gap Discovery
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Most AI tools act as generic summarizers. ResearchLens answers what has already been researched, and more importantly: <strong className="text-amber-200">what is still missing</strong>. It isolates repeated author-reported limitations, contradictory findings, and absent datasets.
          </p>
        </div>

        <Link to={user ? '/research' : '/login'}>
          <Button variant="primary" size="lg" className="whitespace-nowrap px-6">
            Test ResearchLens
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
