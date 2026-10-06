import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  BookOpen,
  Microscope,
  GitCompare,
  AlertTriangle,
  Lightbulb,
  FileBarChart
} from 'lucide-react';

export const Sidebar = () => {
  const { id: projectId } = useParams();

  const primaryNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Investigation', path: '/new-research', icon: PlusCircle }
  ];

  const projectNav = projectId
    ? [
        { label: 'Overview', path: `/research/${projectId}`, icon: FileText },
        { label: 'Indexed Papers', path: `/research/${projectId}/papers`, icon: BookOpen },
        { label: 'Deep Analysis', path: `/research/${projectId}/analysis`, icon: Microscope },
        { label: 'Comparison Matrix', path: `/research/${projectId}/comparison`, icon: GitCompare },
        { label: 'Research Gaps', path: `/research/${projectId}/gaps`, icon: AlertTriangle },
        { label: 'Future Directions', path: `/research/${projectId}/future`, icon: Lightbulb },
        { label: 'Synthesis Report', path: `/research/${projectId}/report`, icon: FileBarChart }
      ]
    : [];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Main Navigation</p>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {projectId && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Active Investigation</p>
            <nav className="space-y-1">
              {projectNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === `/research/${projectId}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* System Status Footnote */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Gemini Reasoning Engine</span>
        </div>
        <p className="text-[11px] text-slate-500">Autonomous literature indexing active</p>
      </div>
    </aside>
  );
};

export default Sidebar;
