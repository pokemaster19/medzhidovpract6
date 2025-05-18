import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, Sun, Moon, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getData, logout } from '../lib/api';

interface Profile {
  email: string;
  created_at: string;
}

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchData();
  }, []);

  async function fetchProfile() {
    try {
      const userData = await getProfile();
      setProfile({
        email: userData.email,
        created_at: new Date(userData.created_at).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      const newData = await getData();
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleSignOut() {
    try {
      await logout();
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
              <div className="flex space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.created_at}</dd>
                </div>
              </dl>
            </div>

            {data && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cached Data</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={fetchData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}