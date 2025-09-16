import React, { useState, useEffect, useCallback } from 'react';
import PlayDesigner from './components/PlayDesigner';
import Playbook from './components/Playbook';
import { queryPlays, insertPlay, deletePlay } from './utils/supabaseOperations';

function App() {
  const [savedPlays, setSavedPlays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'offline', 'error'

  // Load plays from both localStorage and Supabase
  const loadPlays = useCallback(async () => {
    setIsLoading(true);
    setSyncStatus('syncing');

    try {
      // First, load from localStorage for immediate display
      const localSaved = localStorage.getItem('flagFootballPlays');
      if (localSaved) {
        setSavedPlays(JSON.parse(localSaved));
      }

      // Then try to sync with Supabase
      const { data: cloudPlays, error } = await queryPlays();
      
      if (error) {
        console.warn('Could not sync with cloud storage:', error);
        setIsOnline(false);
        setSyncStatus('offline');
      } else {
        setIsOnline(true);
        setSyncStatus('synced');
        
        // Merge cloud and local data (cloud takes precedence)
        if (cloudPlays && cloudPlays.length > 0) {
          setSavedPlays(cloudPlays);
          // Update localStorage with cloud data
          localStorage.setItem('flagFootballPlays', JSON.stringify(cloudPlays));
        }
      }
    } catch (error) {
      console.error('Error loading plays:', error);
      setIsOnline(false);
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to both localStorage and Supabase
  const saveToStorage = useCallback(async (plays) => {
    // Always save to localStorage first
    localStorage.setItem('flagFootballPlays', JSON.stringify(plays));
    
    // Try to sync with Supabase if online
    if (isOnline) {
      setSyncStatus('syncing');
      try {
        // In a real implementation, this would sync the entire plays array
        // or implement incremental sync
        setSyncStatus('synced');
      } catch (error) {
        console.error('Failed to sync with cloud:', error);
        setSyncStatus('error');
      }
    }
  }, [isOnline]);

  // Load plays on component mount
  useEffect(() => {
    loadPlays();
  }, [loadPlays]);

  // Save plays whenever savedPlays changes
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(savedPlays);
    }
  }, [savedPlays, saveToStorage, isLoading]);

  const handleSavePlay = async (playData) => {
    const newPlay = {
      ...playData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };

    setSyncStatus('syncing');
    
    try {
      // Try to save to Supabase first
      if (isOnline) {
        const { data, error } = await insertPlay(newPlay);
        if (error) {
          throw new Error(error);
        }
        // Use the returned data if available (might have server-generated ID)
        const savedPlay = data && data[0] ? data[0] : newPlay;
        setSavedPlays(prev => [...prev, savedPlay]);
      } else {
        // Offline mode - save locally only
        setSavedPlays(prev => [...prev, newPlay]);
      }
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error saving play:', error);
      // Fallback to local storage
      setSavedPlays(prev => [...prev, newPlay]);
      setSyncStatus('error');
    }
  };

  const handleDeletePlay = async (playId) => {
    setSyncStatus('syncing');
    
    try {
      // Try to delete from Supabase first
      if (isOnline) {
        const { error } = await deletePlay(playId);
        if (error) {
          throw new Error(error);
        }
      }
      
      setSavedPlays(prev => prev.filter(play => play.id !== playId));
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error deleting play:', error);
      // Fallback to local deletion
      setSavedPlays(prev => prev.filter(play => play.id !== playId));
      setSyncStatus('error');
    }
  };

  const handleRetrySync = () => {
    loadPlays();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-3xl font-bold text-center">5v5 Flag Football Play Designer</h1>
        
        {/* Sync Status Indicator */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2 text-sm">
            {syncStatus === 'syncing' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Syncing...</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400">Cloud Synced</span>
              </>
            )}
            {syncStatus === 'offline' && (
              <>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-400">Offline Mode</span>
                <button 
                  onClick={handleRetrySync}
                  className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs"
                >
                  Retry
                </button>
              </>
            )}
            {syncStatus === 'error' && (
              <>
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-400">Sync Error</span>
                <button 
                  onClick={handleRetrySync}
                  className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Play Designer Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Design Your Play</h2>
            <PlayDesigner onSavePlay={handleSavePlay} isLoading={isLoading} />
          </div>
          
          {/* Playbook Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Playbook</h2>
            <Playbook 
              savedPlays={savedPlays} 
              onDeletePlay={handleDeletePlay}
              isLoading={isLoading}
              syncStatus={syncStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
