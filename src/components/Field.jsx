import React from 'react';
import Player from './Player';
import useRouteBuilder, { Waypoint } from './RouteBuilder';

function Field({ players, routes, selectedPlayerId, onPlayerMove, onPlayerClick, onPlayerContextMenu, referenceImage, overlaySettings, routeBuilderConfig }) {
  const fieldWidth = 600;
  const fieldHeight = 400;
  
  // Use route builder hook if config is provided
  const routeBuilder = routeBuilderConfig ? useRouteBuilder(routeBuilderConfig) : null;

  // Create path string for route
  const createRoutePath = (points) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  // Get route color based on distance
  const getRouteColor = (route) => {
    const colors = {
      short: '#10B981', // green
      medium: '#F59E0B', // yellow
      long: '#EF4444'    // red
    };
    
    // Determine distance based on route length
    const totalDistance = Math.sqrt(
      Math.pow(route.points[route.points.length - 1].x - route.points[0].x, 2) +
      Math.pow(route.points[route.points.length - 1].y - route.points[0].y, 2)
    );
    
    if (totalDistance < 15) return colors.short;
    if (totalDistance < 25) return colors.medium;
    return colors.long;
  };

  // Get smart label position to avoid overlapping with players
  const getLabelPosition = (route) => {
    const endpoint = route.points[route.points.length - 1];
    const startpoint = route.points[0];
    
    // Calculate route distance
    const routeDistance = Math.sqrt(
      Math.pow(endpoint.x - startpoint.x, 2) +
      Math.pow(endpoint.y - startpoint.y, 2)
    );
    
    // For very short routes (like Hitch), position label further away
    let yOffset = routeDistance < 20 ? -25 : -15;
    
    // If route goes upfield (negative y), position label above endpoint
    // If route goes downfield (positive y), position label below endpoint
    if (endpoint.y > startpoint.y) {
      yOffset = Math.abs(yOffset); // Make positive for downfield routes
    }
    
    return {
      x: endpoint.x,
      y: endpoint.y + yOffset
    };
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Football Field</h3>
        <p className="text-sm text-gray-600">
          Click a player to select them, then assign a route. Drag players to reposition.
        </p>
      </div>
      
      <div className="flex justify-center">
        <svg
          width={fieldWidth}
          height={fieldHeight}
          viewBox={`0 0 ${fieldWidth} ${fieldHeight}`}
          className="border border-gray-400 bg-white"
          style={{ maxWidth: '100%', height: 'auto' }}
          onClick={routeBuilder ? routeBuilder.handleFieldClick : undefined}
        >
          {/* Field background */}
          <rect
            width={fieldWidth}
            height={fieldHeight}
            fill="#ffffff"
          />
          
          {/* Reference image overlay */}
          {referenceImage && overlaySettings && (
            <image
              href={referenceImage.dataUrl}
              x={fieldWidth / 2 + overlaySettings.x - (fieldWidth * overlaySettings.scale) / 2}
              y={fieldHeight / 2 + overlaySettings.y - (fieldHeight * overlaySettings.scale) / 2}
              width={fieldWidth * overlaySettings.scale}
              height={fieldHeight * overlaySettings.scale}
              opacity={overlaySettings.opacity}
              transform={`rotate(${overlaySettings.rotation} ${fieldWidth / 2 + overlaySettings.x} ${fieldHeight / 2 + overlaySettings.y})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}
          
          {/* End zones */}
          <rect
            x="0"
            y="0"
            width={fieldWidth}
            height="20"
            fill="#f3f4f6"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect
            x="0"
            y={fieldHeight - 20}
            width={fieldWidth}
            height="20"
            fill="#f3f4f6"
            stroke="#000000"
            strokeWidth="2"
          />
          
          {/* Sidelines */}
          <line
            x1="0"
            y1="20"
            x2="0"
            y2={fieldHeight - 20}
            stroke="#000000"
            strokeWidth="3"
          />
          <line
            x1={fieldWidth}
            y1="20"
            x2={fieldWidth}
            y2={fieldHeight - 20}
            stroke="#000000"
            strokeWidth="3"
          />
          
          {/* Goal lines */}
          <line
            x1="0"
            y1="20"
            x2={fieldWidth}
            y2="20"
            stroke="#000000"
            strokeWidth="3"
          />
          <line
            x1="0"
            y1={fieldHeight - 20}
            x2={fieldWidth}
            y2={fieldHeight - 20}
            stroke="#000000"
            strokeWidth="3"
          />
          
          {/* 50-yard line */}
          <line
            x1={fieldWidth / 2}
            y1="20"
            x2={fieldWidth / 2}
            y2={fieldHeight - 20}
            stroke="#000000"
            strokeWidth="3"
          />
          
          
          {/* Line of scrimmage (highlighted) */}
          <line
            x1="0"
            y1="240"
            x2={fieldWidth}
            y2="240"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          
          {/* Routes */}
          {routes.map((route, index) => (
            <g key={`route-${route.playerId}-${index}`}>
              <path
                d={createRoutePath(route.points)}
                stroke={getRouteColor(route)}
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              {/* Route label */}
              {route.points.length > 1 && (() => {
                const labelPos = getLabelPosition(route);
                return (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill={getRouteColor(route)}
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                      filter: 'drop-shadow(0px 0px 2px rgba(255,255,255,0.8))'
                    }}
                  >
                    {route.routeName}
                  </text>
                );
              })()}
            </g>
          ))}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#374151"
              />
            </marker>
          </defs>
          
          {/* Players */}
          {players.map(player => (
            <Player
              key={player.id}
              playerData={player}
              isSelected={selectedPlayerId === player.id}
              onMove={onPlayerMove}
              onClick={onPlayerClick}
              onContextMenu={onPlayerContextMenu}
              fieldBounds={{ width: fieldWidth, height: fieldHeight }}
            />
          ))}

          {/* Route Builder Waypoints */}
          {routeBuilder && routeBuilder.waypoints && routeBuilder.waypoints.map((waypoint, index) => (
            <Waypoint
              key={`waypoint-${waypoint.id}`}
              waypoint={waypoint}
              index={index}
              onDrag={routeBuilder.handleWaypointDrag}
              onRemove={routeBuilder.handleRemoveWaypoint}
              isStart={index === 0}
            />
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span>Short Routes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-yellow-500"></div>
          <span>Medium Routes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span>Long Routes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-yellow-400 border-dashed border border-yellow-600"></div>
          <span>Line of Scrimmage</span>
        </div>
      </div>
    </div>
  );
}

export default Field;
