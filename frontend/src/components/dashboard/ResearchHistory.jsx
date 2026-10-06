import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Trash2, ArrowUpRight, Clock, FileBarChart } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { getStatusBadge } from '../../utils/formatResearch';

export const ResearchHistory = ({ projects = [], onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter research archive..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0 font-medium">{filtered.length} total projects</span>
      </div>

      {/* Table / List */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase">
              <th className="py-3 px-4">Research Investigation</th>
              <th className="py-3 px-4 hidden md:table-cell">Domain</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden sm:table-cell">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filtered.map((project) => {
              const status = getStatusBadge(project.status);

              return (
                <tr key={project.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-100 max-w-xs">
                    <NavLink
                      to={`/research/${project.id}`}
                      className="hover:text-blue-400 transition flex items-center gap-1.5"
                    >
                      <span className="truncate">{project.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    </NavLink>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-400">{project.domain}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400">{formatDate(project.created_at)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onDelete && onDelete(project.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete Investigation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchHistory;
