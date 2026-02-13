'use client';
import { useState, useEffect } from 'react';
import UploadForm from "@/components/UploadForm";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/analyses');
        const data = await res.json();
        if (data.data) setHistory(data.data);
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    if (session) fetchHistory();
  }, [session]);

  const handleNewAnalysis = (newAnalysis) => {
    setHistory([newAnalysis, ...history]);
  };

  const handleHistoryClick = (analysis) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedAnalysis(analysis);
  };

  return (
    <div className="container mx-auto p-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Dashboard</h1>
      <p className="mb-8 text-lg text-gray-600">
        Welcome back, <span className="font-semibold text-blue-600">{session?.user?.name}</span>
      </p>
      
      {/* Upload Form */}
      <UploadForm 
        onAnalysisComplete={handleNewAnalysis} 
        externalResult={selectedAnalysis} 
      />

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Scans</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 italic">No resumes scanned yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleHistoryClick(item)} 
                className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                    Score: {item.score}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 truncate mb-1 group-hover:text-blue-600 transition" title={item.fileName}>
                  {item.fileName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.summary}
                </p>
                <p className="text-xs text-blue-600 mt-3 font-semibold opacity-0 group-hover:opacity-100 transition">
                  Click to view details →
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;