import { Activity, Database, Network } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-50">
      <nav className="frosted-glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center neon-glow">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse-slow"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Portfolio Hub</h1>
                <p className="text-sm text-slate-500 font-medium">Real-time Analytics</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#overview" className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group">
                Overview
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#assets" className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group">
                Assets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#networks" className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group">
                Networks
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#protocols" className="text-slate-600 hover:text-purple-600 font-medium transition-colors duration-200 relative group">
                Protocols
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-4 py-2 frosted-glass rounded-full">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">Live</span>
              </div>
              
              <button className="px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}