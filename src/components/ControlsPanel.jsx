import React from 'react';

function ControlsPanel({
  playDetails,
  onPlayDetailsChange,
  routeLibrary,
  playCategories,
  selectedRoute,
  selectedPlayer,
  onRouteSelect,
  onAssignRoute,
  onClearField,
  onSave
}) {
  const handleInputChange = (field, value) => {
    onPlayDetailsChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPlayerName = (playerId) => {
    const playerNames = {
      qb: 'Quarterback',
      c: 'Center',
      rb: 'Running Back',
      wr1: 'WR1',
      wr2: 'WR2'
    };
    return playerNames[playerId] || playerId;
  };

  return (
    <div className="space-y-6">
      {/* Play Details Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Play Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Play Name *
            </label>
            <input
              type="text"
              value={playDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter play name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={playDetails.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {playCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={playDetails.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Brief description of the play"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              vs. Man Defense
            </label>
            <textarea
              value={playDetails.vsMan}
              onChange={(e) => handleInputChange('vsMan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Strategy against man coverage"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              vs. Zone Defense
            </label>
            <textarea
              value={playDetails.vsZone}
              onChange={(e) => handleInputChange('vsZone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Strategy against zone coverage"
            />
          </div>
        </div>
      </div>

      {/* Route Assignment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Route Assignment</h3>
        
        {selectedPlayer && (
          <div className="mb-4 p-3 bg-blue-100 rounded-md">
            <p className="text-sm font-medium text-blue-800">
              Selected Player: {getPlayerName(selectedPlayer)}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {Object.entries(routeLibrary).map(([distance, routes]) => (
            <div key={distance}>
              <h4 className="text-md font-medium text-gray-700 mb-2 capitalize">
                {distance} Routes
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(routes).map(([routeKey, routeData]) => (
                  <button
                    key={routeKey}
                    onClick={() => onRouteSelect(routeKey, routeData)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      selectedRoute?.key === routeKey
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {routeData.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <button
            onClick={onAssignRoute}
            disabled={!selectedPlayer || !selectedRoute}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Assign Route to Player
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onClearField}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear Field
        </button>
        
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Play
        </button>
      </div>
    </div>
  );
}

export default ControlsPanel;
