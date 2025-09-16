import React, { useState, useCallback } from 'react';

// Custom hook for route building logic
function useRouteBuilder({
  playerId, 
  playerPosition, 
  onRouteUpdate, 
  onRouteComplete, 
  onCancel,
  existingRoute = null 
}) {
  const [waypoints, setWaypoints] = useState(
    existingRoute ? existingRoute.points : [{ x: playerPosition.x, y: playerPosition.y, id: 0 }]
  );
  const [isBuilding, setIsBuilding] = useState(true);

  const handleFieldClick = useCallback((e) => {
    if (!isBuilding) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const fieldWidth = 600;
    const fieldHeight = 400;
    const scaleX = fieldWidth / rect.width;
    const scaleY = fieldHeight / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Don't add waypoint if clicking too close to existing waypoint
    const tooClose = waypoints.some(wp => 
      Math.abs(wp.x - x) < 15 && Math.abs(wp.y - y) < 15
    );
    
    if (!tooClose) {
      const newWaypoint = { x, y, id: waypoints.length };
      const newWaypoints = [...waypoints, newWaypoint];
      setWaypoints(newWaypoints);
      
      // Update route in real-time
      onRouteUpdate({
        playerId,
        routeType: 'custom',
        routeName: 'Custom Route',
        points: newWaypoints
      });
    }
  }, [isBuilding, waypoints, playerId, onRouteUpdate]);

  const handleWaypointDrag = useCallback((waypointId, newPosition) => {
    const updatedWaypoints = waypoints.map(wp => 
      wp.id === waypointId ? { ...wp, x: newPosition.x, y: newPosition.y } : wp
    );
    setWaypoints(updatedWaypoints);
    
    // Update route in real-time
    onRouteUpdate({
      playerId,
      routeType: 'custom',
      routeName: 'Custom Route',
      points: updatedWaypoints
    });
  }, [waypoints, playerId, onRouteUpdate]);

  const handleRemoveWaypoint = useCallback((waypointId) => {
    if (waypoints.length <= 2) return; // Keep at least start and one waypoint
    
    const filteredWaypoints = waypoints
      .filter(wp => wp.id !== waypointId)
      .map((wp, index) => ({ ...wp, id: index })); // Renumber IDs
    
    setWaypoints(filteredWaypoints);
    
    onRouteUpdate({
      playerId,
      routeType: 'custom',
      routeName: 'Custom Route',
      points: filteredWaypoints
    });
  }, [waypoints, playerId, onRouteUpdate]);

  const handleComplete = useCallback(() => {
    setIsBuilding(false);
    onRouteComplete({
      playerId,
      routeType: 'custom',
      routeName: 'Custom Route',
      points: waypoints
    });
  }, [waypoints, playerId, onRouteComplete]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return {
    waypoints,
    isBuilding,
    handleFieldClick,
    handleWaypointDrag,
    handleRemoveWaypoint,
    handleComplete,
    handleCancel
  };
}

// Waypoint component for rendering draggable points
function Waypoint({ waypoint, index, onDrag, onRemove, isStart = false }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const fieldWidth = 600;
    const fieldHeight = 400;
    const scaleX = fieldWidth / rect.width;
    const scaleY = fieldHeight / rect.height;
    
    const x = Math.max(15, Math.min(fieldWidth - 15, (e.clientX - rect.left) * scaleX));
    const y = Math.max(25, Math.min(fieldHeight - 25, (e.clientY - rect.top) * scaleY));
    
    onDrag(waypoint.id, { x, y });
  }, [isDragging, waypoint.id, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isStart) {
      onRemove(waypoint.id);
    }
  }, [isStart, waypoint.id, onRemove]);

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Waypoint circle */}
      <circle
        cx={waypoint.x}
        cy={waypoint.y}
        r={isStart ? "8" : "6"}
        fill={isStart ? "#DC2626" : "#2563EB"}
        stroke="#ffffff"
        strokeWidth="2"
        className="transition-all duration-200"
      />
      
      {/* Waypoint number */}
      <text
        x={waypoint.x}
        y={waypoint.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="8"
        fontWeight="bold"
        pointerEvents="none"
      >
        {index + 1}
      </text>
      
      {/* Remove hint for non-start waypoints */}
      {!isStart && (
        <text
          x={waypoint.x}
          y={waypoint.y - 15}
          textAnchor="middle"
          fill="#6B7280"
          fontSize="6"
          pointerEvents="none"
          opacity="0.7"
        >
          Double-click to remove
        </text>
      )}
    </g>
  );
}

export default useRouteBuilder;
export { Waypoint };
