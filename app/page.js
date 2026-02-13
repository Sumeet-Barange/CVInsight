'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, BarChart, Building2, FileText } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
            Unlock Your Career Potential
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            The intelligent platform to score your resume, match with top companies with our extensive placement database.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href={session ? "/dashboard" : "/api/auth/signin"}
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
            >
              {session ? "Analyse Your Resume" : "Get Started for Free"}
              
            </Link>
            
            {/* REMOVED "VIEW COMPANIES" BUTTON HERE */}
          </div>
        </div>
        
        {/* Background Blob decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why use CVInsight?</h2>
            <p className="text-gray-500">Everything you need to crack your dream job.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Resume Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your resume and get an instant score out of 100. Our AI identifies weaknesses and suggests actionable keywords to pass ATS filters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Target Company Match</h3>
              <p className="text-gray-600 leading-relaxed">
                Select a target company and see exactly how well your resume fits their specific requirements.
              </p>
            </div>

            {/* Feature 3 - Renamed to Database */}
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ATS Score Checker</h3>
              <p className="text-gray-600 leading-relaxed">
                See how your resume scores against Applicant Tracking Systems used by top companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center">
        <p className="text-gray-500">
          Built for students, by students. 🚀 <br />
          <span className="text-sm mt-2 block">© {new Date().getFullYear()} CVInsight</span>
        </p>
      </footer>
    </div>
  );
}