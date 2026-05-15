import React, { useState, useEffect } from "react";
import CreateProject from "./createProject";

// Updated to match your backend's exact Mongoose schema response
interface Project {
  _id: string; // Mongoose ID
  repoName: string;
  repoFullName: string;
  defaultBranch: string;
  repoId: number;
  createdAt: string;
  status?: "running" | "stopped" |  "failed" | "starting"; 
  url?: string; 
}

interface ProjectsResponse {
  count: number;
  projects: Project[];
}

export default function Dashboard() {
  const [view, setView] = useState<"dashboard" | "create">("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const[loadingProjects, setLoadingProjects] = useState<boolean>(true);

  // Fetch projects from your backend
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch("https://deployservers-backend.onrender.com/api/projects", { 
        method: "GET",
        credentials: "include" 
      });

      if (response.status === 401 || response.status === 403) {
        console.log("Unauthorized, redirecting to login...");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data: ProjectsResponse = await response.json();
      setProjects(data.projects);

    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (view === "dashboard") {
      fetchProjects();
    }
  }, [view]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* ========================================== */}
      {/* CUSTOM ANIMATION CSS & BACKGROUND EFFECTS  */}
      {/* ========================================== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes drift {
          from { transform: translateX(-20vw); }
          to { transform: translateX(120vw); }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-fast { animation: float 5s ease-in-out infinite; }
        .animate-drift-slow { animation: drift 60s linear infinite; }
        .animate-drift-fast { animation: drift 40s linear infinite; }
        
        /* Glass card hover effect */
        .glass-card {
          background: rgba(20, 20, 20, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .glass-card:hover {
          background: rgba(30, 30, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen"></div>

        {/* Drifting Clouds (Abstract Tech Clouds) */}
        <div className="absolute top-[15%] left-0 w-full animate-drift-slow opacity-[0.03]">
          <svg width="400" height="200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>
        <div className="absolute top-[50%] left-0 w-full animate-drift-fast opacity-[0.02] delay-1000">
          <svg width="300" height="150" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        </div>

        {/* Floating Server Racks */}
        <div className="absolute right-[10%] top-[20%] animate-float-slow opacity-[0.15]">
          <svg width="120" height="180" viewBox="0 0 24 24" fill="none" stroke="url(#blue-grad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
            <line x1="10" y1="6" x2="18" y2="6"></line>
            <line x1="10" y1="18" x2="18" y2="18"></line>
          </svg>
        </div>
        <div className="absolute left-[5%] bottom-[20%] animate-float-fast opacity-[0.1]">
          <svg width="160" height="240" viewBox="0 0 24 24" fill="none" stroke="url(#purple-grad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="6" rx="1"></rect>
            <rect x="2" y="9" width="20" height="6" rx="1"></rect>
            <rect x="2" y="16" width="20" height="6" rx="1"></rect>
            <circle cx="6" cy="5" r="1" fill="#ec4899"></circle>
            <circle cx="6" cy="12" r="1" fill="#ec4899"></circle>
            <circle cx="6" cy="19" r="1" fill="#ec4899"></circle>
            <line x1="10" y1="5" x2="18" y2="5"></line>
            <line x1="10" y1="12" x2="18" y2="12"></line>
            <line x1="10" y1="19" x2="18" y2="19"></line>
          </svg>
        </div>
      </div>

      {/* ========================================== */}
      {/* FOREGROUND CONTENT                         */}
      {/* ========================================== */}
      <div className="relative z-10">
        
        {/* Glassmorphism Navbar */}
        <nav className="sticky top-0 z-50 glass-card border-b border-white/5 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => setView("dashboard")}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block">
                  deploy-servers
                </span>
              </div>
              
              <div className="h-5 w-px bg-white/20 mx-2"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 cursor-default">
                  Personal
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-sm font-medium text-white cursor-default">
                  {view === "dashboard" ? "Dashboard" : "New Project"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Documentation
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
                <div className="h-full w-full bg-black rounded-full border border-white/10"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Layout Area */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
          
          {/* ========================================== */}
          {/* VIEW: PROJECTS DASHBOARD                   */}
          {/* ========================================== */}
          {view === "dashboard" && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                  Overview
                </h1>
                <button 
                  onClick={() => setView("create")}
                  className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add New Project
                </button>
              </div>

              {loadingProjects ? (
                // Loading Skeleton (Flexible)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="min-h-[12rem] glass-card rounded-2xl animate-pulse p-6 flex flex-col justify-between">
                      <div className="flex gap-4 items-center mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-full shrink-0"></div>
                        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                // Active Projects Grid (Flexible & Translucent)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => {
                    const projectStatus = project.status || "building";
                    const projectUrl = project.url || '';

                    return (
                      <div key={project._id} className="group min-h-[12rem] h-auto glass-card rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 relative overflow-hidden">
                        
                        {/* Inner Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            
                            {/* Icon & Title (Flexible Wrap) */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300 shadow-inner">
                                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                {/* break-words & line-clamp ensure long names don't break layout */}
                                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors break-words line-clamp-2">
                                  {project.repoName}
                                </h3>
                              </div>
                            </div>
                            
                            {/* Status Indicator (Shrink-0 prevents it from squishing) */}
                            <div className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                              projectStatus === 'running' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              projectStatus === 'starting' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${projectStatus === 'building' ? 'animate-pulse bg-yellow-400 shadow-[0_0_8px_#facc15]' : projectStatus === 'running' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400 shadow-[0_0_8px_#f87171]'}`}></span>
                              {projectStatus}
                            </div>
                          </div>

                          {/* Meta info, flexibly wrapping */}
                          <div className="mt-auto pt-4 flex flex-col gap-1.5 text-sm text-gray-400">
                            <p className="flex items-center gap-2 break-all line-clamp-1 group-hover:text-gray-300 transition-colors">
                              <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                              {project.repoFullName} • {project.defaultBranch}
                            </p>
                          </div>
                        </div>

                        {/* Footer info */}
                        <div className="mt-5 pt-4 border-t border-white/10 relative z-10 flex flex-wrap gap-2 justify-between items-center text-sm">
                          <span className="font-medium text-gray-300 group-hover:text-white transition-colors truncate max-w-[70%]">
                           <a
  href={projectUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="font-medium text-gray-300 hover:text-white transition-colors truncate max-w-[70%] block"
>
  {projectUrl}
</a>
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-md shrink-0">
                            {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Enhanced Empty State with Glassmorphism
                <div className="glass-card rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden group">
                  {/* Subtle hover pulse in empty state */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-12 h-12 text-blue-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">No deployments yet</h2>
                    <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                      Connect a GitHub repository to deploy your first backend service. We handle the servers, auto-scaling, and SSL automatically.
                    </p>
                    <button 
                      onClick={() => setView("create")}
                      className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center gap-3 text-lg"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                      Import Git Repository
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW: CREATE PROJECT (IMPORT REPO)         */}
          {/* ========================================== */}
          {view === "create" && (
            <div className="relative z-10 glass-card p-2 rounded-3xl border border-white/5 shadow-2xl">
              <CreateProject 
                onBack={() => setView("dashboard")} 
                onDeploySuccess={() => {
                  setView("dashboard");
                  fetchProjects(); 
                }} 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}