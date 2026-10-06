import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Copy, Check, FileText, BookOpen, PlusCircle } from 'lucide-react';
import Button from '../common/Button';

export const ReportViewer = ({ report }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
        <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-300">No report generated yet</p>
        <p className="text-xs text-slate-500 mt-1">Execute the research pipeline to synthesize the academic report.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(report.markdown_content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([report.markdown_content || ''], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${(report.title || 'ResearchLens-Report').replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleStartNewResearch = () => {
    navigate('/research');
  };

  return (
    <div className="space-y-6">
      {/* Report Action Header (Section 26: Copy Report | Download Report | Start New Research) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">
            Evidence-Backed Synthesis Report
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">{report.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" icon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy Report'}
          </Button>
          <Button size="sm" variant="outline" icon={Download} onClick={handleDownload}>
            Download Report
          </Button>
          <Button size="sm" variant="primary" icon={PlusCircle} onClick={handleStartNewResearch}>
            Start New Research
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      {report.executive_summary && (
        <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Executive Summary
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">{report.executive_summary}</p>
        </div>
      )}

      {/* Main Content Layout with TOC */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of contents */}
        {report.table_of_contents && report.table_of_contents.length > 0 && (
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sections</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {report.table_of_contents.map((item, idx) => (
                  <li key={idx} className="hover:text-blue-400 transition cursor-pointer truncate">
                    • {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Markdown Render Container */}
        <div className={`${report.table_of_contents?.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 leading-relaxed font-sans prose prose-invert max-w-none space-y-4">
            <div className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-7">
              {report.markdown_content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
