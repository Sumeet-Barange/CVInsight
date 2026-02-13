'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Database } from 'lucide-react'; // Added Database icon

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. PROJECT NAME CHANGE */}
        <Link href="/" className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          
          CVInsight
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {/* 2. RENAMED CHRONICLES TO DATABASE */}
          

          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Dashboard
              </Link>
              
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800">{session.user.name}</span>
                  <span className="text-xs text-gray-500">{session.user.email}</span>
                </div>
                
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/api/auth/signin" 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;