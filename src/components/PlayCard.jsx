import React from 'react';

function PlayCard({ playData, onDelete }) {
  const fieldWidth = 400;
  const fieldHeight = 250;

  // Create path string for route
  const createRoutePath = (points) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  // Scale coordinates for smaller display
  const scaleCoordinate = (coord, dimension) => {
    const scale = dimension === 'x' ? fieldWidth / 600 : fieldHeight / 400;
    return coord * scale;
  };

  // Get route color based on distance
  const getRouteColor = (route) => {
    const colors = {
      short: '#10B981', // green
      medium: '#F59E0B', // yellow
      long: '#EF4444'    // red
    };
    
    const totalDistance = Math.sqrt(
      Math.pow(route.points[route.points.length - 1].x - route.points[0].x, 2) +
      Math.pow(route.points[route.points.length - 1].y - route.points[0].y, 2)
    );
    
    if (totalDistance < 15) return colors.short;
    if (totalDistance < 25) return colors.medium;
    return colors.long;
  };

  // Get player color based on position
  const getPlayerColor = (type) => {
    const colors = {
      QB: '#DC2626',   // red
      C: '#7C3AED',    // purple
      RB: '#059669',   // green
      WR1: '#2563EB',  // blue
      WR2: '#2563EB',  // blue
      WR3: '#2563EB',  // blue
      WR4: '#2563EB'   // blue
    };
    return colors[type] || '#6B7280';
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playData.name}"?`)) {
      onDelete(playData.id);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 print:break-inside-avoid print:page-break-inside-avoid">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 print:mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 print:text-2xl">{playData.name}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {playData.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(playData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 print:hidden"
          title="Delete play"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Description */}
      {playData.description && (
        <p className="text-gray-700 mb-4 print:mb-6">{playData.description}</p>
      )}

      {/* Field Diagram */}
      <div className="mb-6 print:mb-8">
        <div className="flex justify-center">
          <svg
            width={fieldWidth}
            height={fieldHeight}
            viewBox={`0 0 ${fieldWidth} ${fieldHeight}`}
            className="border border-gray-400 bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {/* Field background */}
            <rect width={fieldWidth} height={fieldHeight} fill="#ffffff" />
            
            {/* End zones */}
            <rect x="0" y="0" width={fieldWidth} height="12" fill="#f3f4f6" stroke="#000000" strokeWidth="1" />
            <rect x="0" y={fieldHeight - 12} width={fieldWidth} height="12" fill="#f3f4f6" stroke="#000000" strokeWidth="1" />
            
            {/* Sidelines and goal lines */}
            <line x1="0" y1="12" x2="0" y2={fieldHeight - 12} stroke="#000000" strokeWidth="2" />
            <line x1={fieldWidth} y1="12" x2={fieldWidth} y2={fieldHeight - 12} stroke="#000000" strokeWidth="2" />
            <line x1="0" y1="12" x2={fieldWidth} y2="12" stroke="#000000" strokeWidth="2" />
            <line x1="0" y1={fieldHeight - 12} x2={fieldWidth} y2={fieldHeight - 12} stroke="#000000" strokeWidth="2" />
            
            {/* 50-yard line */}
            <line x1={fieldWidth / 2} y1="12" x2={fieldWidth / 2} y2={fieldHeight - 12} stroke="#000000" strokeWidth="2" />
            
            {/* Yard lines */}
            {[1, 2, 3, 4, 6, 7, 8, 9].map(i => (
              <line
                key={`yard-${i}`}
                x1={(fieldWidth / 10) * i}
                y1="12"
                x2={(fieldWidth / 10) * i}
                y2={fieldHeight - 12}
                stroke="#000000"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            
            {/* Line of scrimmage */}
            <line
              x1="0"
              y1={scaleCoordinate(240, 'y')}
              x2={fieldWidth}
              y2={scaleCoordinate(240, 'y')}
              stroke="#FBBF24"
              strokeWidth="2"
              strokeDasharray="3,3"
            />
            
            {/* Routes */}
            {playData.routes?.map((route, index) => (
              <g key={`route-${route.playerId}-${index}`}>
                <path
                  d={createRoutePath(route.points.map(point => ({
                    x: scaleCoordinate(point.x, 'x'),
                    y: scaleCoordinate(point.y, 'y')
                  })))}
                  stroke={getRouteColor(route)}
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-small)"
                />
              </g>
            ))}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead-small"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#374151" />
              </marker>
            </defs>
            
            {/* Players */}
            {playData.players?.map(player => (
              <g key={player.id}>
                <circle
                  cx={scaleCoordinate(player.x, 'x')}
                  cy={scaleCoordinate(player.y, 'y')}
                  r="8"
                  fill={getPlayerColor(player.type)}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <text
                  x={scaleCoordinate(player.x, 'x')}
                  y={scaleCoordinate(player.y, 'y') + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                >
                  {player.type}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Strategy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-8">
        {playData.vsMan && (
          <div>
            <h4 className="font-bold text-gray-900 mb-2 print:text-lg">vs. Man Defense</h4>
            <p className="text-sm text-gray-700 print:text-base leading-relaxed">{playData.vsMan}</p>
          </div>
        )}
        
        {playData.vsZone && (
          <div>
            <h4 className="font-bold text-gray-900 mb-2 print:text-lg">vs. Zone Defense</h4>
            <p className="text-sm text-gray-700 print:text-base leading-relaxed">{playData.vsZone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayCard;
