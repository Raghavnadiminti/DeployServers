import React, { useState, useEffect } from "react";

// Types
export interface Repository {
  id: number | string;
  name: string;
  full_name?: string;
  isPrivate: boolean;
  language: string | null;
  updated: string;
}

interface CreateProjectProps {
  onBack: () => void;
  onDeploySuccess: () => void;
}

export default function CreateProject({ onBack, onDeploySuccess }: CreateProjectProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [repoError, setRepoError] = useState<string | null>(null);
  const[searchQuery, setSearchQuery] = useState<string>("");
  const [deployingRepo, setDeployingRepo] = useState<string | null>(null);

  // Fetch Repos on mount
  useEffect(() => {
    const fetchRepos = async () => {
      setLoadingRepos(true);
      try {
        const response = await fetch("https://deployservers-backend.onrender.com/api/repos", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }

        const data: Repository[] = await response.json();
        setRepos(data);
      } catch (err) {
        console.error("Error loading repos:", err);
        setRepoError("Failed to load repositories from GitHub. Please try again.");
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  },[]);

  const handleDeploy = async (repoFullName: string) => {
    setDeployingRepo(repoFullName);

    try {
      const response = await fetch(
        "https://deployservers-backend.onrender.com/api/projects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ repoFullName }),
        }
      );

      if (response.status === 500) {
        alert("GitHub App is not installed for this repository. Redirecting to installation...");
        window.location.href = "https://github.com/apps/deployservers/installations/new";
        return;
      }

      if (!response.ok) throw new Error("Failed to set up deployment");

      console.log("Deployment triggered successfully");
      
      // Notify the parent Dashboard that deployment started successfully!
      onDeploySuccess();

    } catch (err) {
      console.error("Deploy error:", err);
      alert(`Error deploying ${repoFullName}. Check console for details.`);
    } finally {
      setDeployingRepo(null);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.full_name && repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <div className="p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Import Git Repository</h1>
        <p className="text-gray-400 text-lg">Select a repository from your GitHub account to deploy a new application.</p>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#141414]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Repository List */}
        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
          {loadingRepos ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 sm:p-6 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-full"></div>
                  <div>
                    <div className="w-40 h-5 bg-white/10 rounded-md mb-2"></div>
                    <div className="w-24 h-4 bg-white/5 rounded-md"></div>
                  </div>
                </div>
                <div className="w-24 h-10 bg-white/10 rounded-xl"></div>
              </div>
            ))
          ) : repoError ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-red-400 font-semibold mb-2 text-lg">Failed to load repositories</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">{repoError}</p>
            </div>
          ) : filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => {
              const repoTargetName = repo.full_name || repo.name;
              const isDeploying = deployingRepo === repoTargetName;

              return (
                <div key={repo.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 group-hover:text-white group-hover:border-white/20 transition-all shadow-sm">
                      {repo.isPrivate ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors text-base">
                          {repoTargetName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/5 text-gray-400 border border-white/10">
                          {repo.isPrivate ? "Private" : "Public"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className={`w-2 h-2 rounded-full shadow-sm ${repo.language === 'TypeScript' ? 'bg-blue-400' : repo.language === 'Python' ? 'bg-yellow-400' : repo.language === 'Go' ? 'bg-cyan-400' : repo.language === 'JavaScript' ? 'bg-yellow-300' : 'bg-red-400'}`}></span>
                            {repo.language}
                          </span>
                        )}
                        {repo.language && <span>•</span>}
                        <span>Updated {repo.updated || "recently"}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeploy(repoTargetName)}
                    disabled={isDeploying || deployingRepo !== null}
                    className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                      isDeploying 
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 cursor-not-allowed" 
                        : deployingRepo !== null 
                          ? "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
                          : "bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    }`}
                  >
                    {isDeploying ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Importing...
                      </>
                    ) : (
                      "Import"
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">No repositories found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">We couldn't find any repositories matching "{searchQuery}". Check your spelling or ensure the GitHub app has access.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}