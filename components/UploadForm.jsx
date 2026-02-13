'use client';
import { useState, useEffect } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, Building2 } from 'lucide-react';

const UploadForm = ({ onAnalysisComplete, externalResult }) => {
  const [file, setFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); 
  const [jdFile, setJdFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("none"); 

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data.data || []);
      } catch (err) {
        console.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (externalResult) {
      setResult(externalResult);
      setFile(null);
    }
  }, [externalResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (mode === "company" && selectedCompanyId) {
        const company = companies.find(c => c._id === selectedCompanyId);
        if (company) {
          const companyText = `
            Target Company: ${company.name}
            Target Roles: ${company.roles.join(', ')}
            Required Branches: ${company.eligibleBranches.join(', ')}
            Interview Process/Criteria: ${company.studentExperience}
          `;
          formData.append('jdText', companyText);
        }
      } else if (mode === "pdf" && jdFile) {
        formData.append('jdFile', jdFile);
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        if (onAnalysisComplete) {
          onAnalysisComplete({
            _id: Date.now(),
            fileName: file.name,
            score: data.data.score,
            summary: data.data.summary,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        alert("Error: " + data.error);
      }
      
    } catch (error) {
      console.error("Analysis Failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* 1. RESUME UPLOAD */}
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:bg-blue-50 transition cursor-pointer relative bg-blue-50/30">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => { setFile(e.target.files[0]); setResult(null); }} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-lg text-gray-700">
                {file ? file.name : "Upload Resume (PDF)"}
              </p>
            </div>
          </div>

          {/* 2. TARGET SELECTION (Tabs) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3">Compare Against (Optional):</label>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <button type="button" onClick={() => setMode("none")} className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${mode === 'none' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>General Scan</button>
              <button type="button" onClick={() => setMode("company")} className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${mode === 'company' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-blue-50'}`}>Select Company</button>
              <button type="button" onClick={() => setMode("pdf")} className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${mode === 'pdf' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:bg-indigo-50'}`}>Upload Job Description PDF</button>
            </div>

            {/* MODE: COMPANY DROPDOWN */}
            {mode === "company" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white outline-none"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    <option value="">-- Choose a Target Company --</option>
                    {companies.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.roles[0] || "General"})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  * Analysis uses real placement data from our database.
                </p>
              </div>
            )}

            {/* MODE: PDF UPLOAD */}
            {mode === "pdf" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                 <input 
                   type="file" 
                   accept=".pdf" 
                   onChange={(e) => setJdFile(e.target.files[0])}
                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                 />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!file || isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex justify-center items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Analyze Resume"}
          </button>
        </form>
      </div>

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
           {/* Score Card */}
           <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode !== 'none' ? "Compatibility Score" : "Resume Score"}
                </h2>
                <p className="text-gray-600 mt-1">{result.summary}</p>
              </div>
              <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-4 ${
                result.score >= 80 ? 'border-green-100 bg-green-50 text-green-700' : 
                result.score >= 50 ? 'border-yellow-100 bg-yellow-50 text-yellow-700' : 
                'border-red-100 bg-red-50 text-red-700'
              }`}>
                <span className="text-3xl font-bold">{result.score}</span>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {mode !== 'none' ? "Matching Skills" : "Strengths"}
            </h3>
            <ul className="space-y-3">
              {result.strengths?.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm flex gap-3 items-start">
                  <span className="text-green-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {mode !== 'none' ? "Missing / To Improve" : "Improvements"}
            </h3>
            <ul className="space-y-3">
              {result.improvements?.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm flex gap-3 items-start">
                  <span className="text-red-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;