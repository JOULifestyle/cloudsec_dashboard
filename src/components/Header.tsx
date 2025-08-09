import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow p-4 flex items-center justify-between">
      <div className="text-xl font-bold text-green-600">CloudSec</div>
      <nav className="space-x-4">
        {userEmail && (
          <>
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-200">Dashboard</Link>
            <Link to="/scan/cspm" className="text-gray-700 dark:text-gray-200">CSPM Scan</Link>
            <Link to="/scan/cwpp" className="text-gray-700 dark:text-gray-200">CWPP Scan</Link>
            <Link to="/history" className="text-gray-700 dark:text-gray-200">Scan History</Link>
            <Link to="/policy-violations" className="text-gray-700 dark:text-gray-200">Policy Violations</Link>
          </>
        )}
      </nav>
      <div className="flex items-center space-x-4">
        {userEmail ? (
          <>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {userEmail[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
