import React, { useState, useEffect } from "react";

interface Repository {
  id: number | string;
  name: string;
  full_name?: string; // Added full_name as GitHub typically uses this for "user/repo" format
  isPrivate: boolean; // Note: if your backend sends raw github data, this might be `private` instead
  language: string | null;
  updated: string; 
}

export default function Dashboard() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const[error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // New state to track which repo is currently being deployed
  const[deployingRepo, setDeployingRepo] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        //https://deployservers-backend.onrender.com/api/repos
      
        const response = await fetch("https://deployservers-backend.onrender.com/api/repos", {
          method: "GET",
          credentials: "include", 
        });

        // if (response.status === 401 || response.status === 403) {
        //   console.log("Unauthorized, redirecting to login...");
        //   window.location.href = "/";
        //   return;
        // }

        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }

        const data: Repository[] = await response.json();
        setRepos(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load repositories from GitHub. Please try again.");
        setLoading(false);
      }
    };

    fetchRepos();
  },[]);

  // Updated to async function making POST request to /api/projects
  const handleDeploy = async (repoFullName: string) => {
    setDeployingRepo(repoFullName);
    
    try {
      const response = await fetch("https://deployservers-backend.onrender.com/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Required to authenticate the post request
        body: JSON.stringify({ repoFullName }), // Match your backend req.body mapping
      });

      if (!response.ok) {
        throw new Error("Failed to set up deployment");
      }

      const data = await response.json();
      console.log("Deployment triggered successfully:", data);
      alert(`Successfully set up deployment for ${repoFullName}!`);
      
      // Optional: Redirect user to the project logs or configuration page here
      // window.location.href = `/project/${repoFullName}`;

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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Dashboard Navbar */}
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              deploy-servers
            </span>
          </div>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 font-medium">Dashboard</span>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Support
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 cursor-pointer"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Let's build something new.</h1>
          <p className="text-gray-400">To deploy a new application, import an existing Git Repository.</p>
        </div>

        {/* Import Git Repository Section */}
        <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header & Search */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#161616]">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Import Git Repository
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Repository List */}
          <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 sm:p-6 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    <div>
                      <div className="w-32 h-4 bg-white/10 rounded mb-2"></div>
                      <div className="w-24 h-3 bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-9 bg-white/10 rounded-lg"></div>
                </div>
              ))
            ) : error ? (
              // Error State
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-red-400 font-medium mb-1">Error Loading Repositories</h3>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : filteredRepos.length > 0 ? (
              // Fetched Repositories
              filteredRepos.map((repo) => {
                // Prefer full_name (e.g., "username/repo") if available from API, otherwise fallback to name
                const repoTargetName = repo.full_name || repo.name;
                const isDeploying = deployingRepo === repoTargetName;

                return (
                  <div key={repo.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-4">
                      {/* Repo Icon (Public/Private) */}
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 group-hover:text-blue-400 transition-colors">
                        {repo.isPrivate ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Repo Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {repoTargetName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-gray-400 border border-white/10">
                            {repo.isPrivate ? "Private" : "Public"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-3">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${repo.language === 'TypeScript' ? 'bg-blue-400' : repo.language === 'Python' ? 'bg-yellow-400' : repo.language === 'Go' ? 'bg-cyan-400' : 'bg-red-400'}`}></span>
                              {repo.language}
                            </span>
                          )}
                          {repo.language && <span>•</span>}
                          <span>Updated {repo.updated || "recently"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <button 
                      onClick={() => handleDeploy(repoTargetName)}
                      disabled={isDeploying || deployingRepo !== null}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
                        isDeploying 
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
                          : deployingRepo !== null 
                            ? "bg-gray-200 text-black opacity-50 cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {isDeploying ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deploying...
                        </>
                      ) : (
                        "Deploy"
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              /* Empty Search State */
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-gray-300 font-medium mb-1">No repositories found</h3>
                <p className="text-sm text-gray-500">We couldn't find any repos matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}