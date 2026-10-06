import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Compass, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Research<span className="text-blue-400">Lens</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AI</span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none">Autonomous Literature Intelligence</p>
          </div>
        </Link>

        {/* Action Center */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/new-research">
                <Button size="sm" variant="primary" icon={PlusCircle}>
                  <span className="hidden sm:inline">New Research</span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-slate-800 mx-1" />

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">{user?.fullName || 'Researcher'}</p>
                  <p className="text-slate-400 leading-tight">{user?.organization || 'Scientific Labs'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
