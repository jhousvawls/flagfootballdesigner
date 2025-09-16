import React from 'react';

function PlayerContextMenu({ 
  player, 
  position, 
  routeLibrary, 
  onRouteSelect, 
  onClearRoute, 
  onBuildCustomRoute,
  onClose,
  hasRoute 
}) {
  const handleRouteClick = (routeKey, routeData) => {
    onRouteSelect(routeKey, routeData);
    onClose();
  };

  const handleClearRoute = () => {
    onClearRoute();
    onClose();
  };

  const handleBuildCustomRoute = () => {
    onBuildCustomRoute();
    onClose();
  };

  return (
    <div 
      className="absolute bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-64"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800">
          {player.position} ({player.type})
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg font-bold"
        >
          ×
        </button>
      </div>

      {/* Route Selection */}
      <div className="space-y-3">
        {Object.entries(routeLibrary).map(([distance, routes]) => (
          <div key={distance}>
            <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
              {distance} Routes
            </h5>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(routes).map(([routeKey, routeData]) => (
                <button
                  key={routeKey}
                  onClick={() => handleRouteClick(routeKey, routeData)}
                  className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  {routeData.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
        <button
          onClick={handleBuildCustomRoute}
          className="w-full px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors font-medium"
        >
          🎯 Build Custom Route
        </button>
        
        {hasRoute && (
          <button
            onClick={handleClearRoute}
            className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Clear Route
          </button>
        )}
        <p className="text-xs text-gray-500 text-center">
          Drag player to reposition
        </p>
      </div>
    </div>
  );
}

export default PlayerContextMenu;
