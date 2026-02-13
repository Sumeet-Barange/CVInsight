'use client';
import { useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';

export default function AdminPanel() {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);

    try {
      const res = await fetch('/api/admin/ingest', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error uploading");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin: Ingest Database</h1>
      <form onSubmit={handleUpload} className="space-y-4 bg-white p-6 shadow-sm border rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="w-full border p-2 rounded" 
          />
        </div>
        <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !file}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-black transition"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <UploadCloud />} 
          Ingest CSV
        </button>
      </form>
      {result && <div className="mt-4 text-green-600 font-bold">{result.message}</div>}
    </div>
  );
}