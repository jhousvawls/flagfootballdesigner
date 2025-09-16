import React, { useState, useEffect } from 'react';
import PlayDesigner from './components/PlayDesigner';
import Playbook from './components/Playbook';

function App() {
  const [savedPlays, setSavedPlays] = useState([]);

  // Load saved plays from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('flagFootballPlays');
    if (saved) {
      setSavedPlays(JSON.parse(saved));
    }
  }, []);

  // Save plays to localStorage whenever savedPlays changes
  useEffect(() => {
    localStorage.setItem('flagFootballPlays', JSON.stringify(savedPlays));
  }, [savedPlays]);

  const handleSavePlay = (playData) => {
    const newPlay = {
      ...playData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    setSavedPlays(prev => [...prev, newPlay]);
  };

  const handleDeletePlay = (playId) => {
    setSavedPlays(prev => prev.filter(play => play.id !== playId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-3xl font-bold text-center">5v5 Flag Football Play Designer</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Play Designer Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Design Your Play</h2>
            <PlayDesigner onSavePlay={handleSavePlay} />
          </div>
          
          {/* Playbook Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Playbook</h2>
            <Playbook 
              savedPlays={savedPlays} 
              onDeletePlay={handleDeletePlay}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
