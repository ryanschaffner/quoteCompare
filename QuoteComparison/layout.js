import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Upload, BarChart3 } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">InsureCompare</h1>
                <p className="text-xs text-slate-500 font-medium">Professional Quote Analysis</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to={createPageUrl("Dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === createPageUrl("Dashboard")
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline-block mr-2" />
                Dashboard
              </Link>
              <Link 
                to={createPageUrl("Upload")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === createPageUrl("Upload")
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4 inline-block mr-2" />
                New Comparison
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link 
            to={createPageUrl("Dashboard")}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
              location.pathname === createPageUrl("Dashboard")
                ? 'bg-slate-900 text-white'
                : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link 
            to={createPageUrl("Upload")}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
              location.pathname === createPageUrl("Upload")
                ? 'bg-slate-900 text-white'
                : 'text-slate-600'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs font-medium">Upload</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}