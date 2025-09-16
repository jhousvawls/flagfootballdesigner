import React, { useState, useCallback } from 'react';

function Player({ playerData, isSelected, onMove, onClick, fieldBounds }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const scaleX = fieldBounds.width / rect.width;
    const scaleY = fieldBounds.height / rect.height;
    
    setDragStart({
      x: (e.clientX - rect.left) * scaleX - playerData.x,
      y: (e.clientY - rect.top) * scaleY - playerData.y
    });
  }, [playerData.x, playerData.y, fieldBounds]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const scaleX = fieldBounds.width / rect.width;
    const scaleY = fieldBounds.height / rect.height;
    
    const newX = Math.max(15, Math.min(fieldBounds.width - 15, 
      (e.clientX - rect.left) * scaleX - dragStart.x));
    const newY = Math.max(25, Math.min(fieldBounds.height - 25, 
      (e.clientY - rect.top) * scaleY - dragStart.y));
    
    onMove(playerData.id, { x: newX, y: newY });
  }, [isDragging, dragStart, onMove, playerData.id, fieldBounds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!isDragging) {
      onClick(playerData.id);
    }
  }, [isDragging, onClick, playerData.id]);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const scaleX = fieldBounds.width / rect.width;
    const scaleY = fieldBounds.height / rect.height;
    
    setDragStart({
      x: (touch.clientX - rect.left) * scaleX - playerData.x,
      y: (touch.clientY - rect.top) * scaleY - playerData.y
    });
  }, [playerData.x, playerData.y, fieldBounds]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const scaleX = fieldBounds.width / rect.width;
    const scaleY = fieldBounds.height / rect.height;
    
    const newX = Math.max(15, Math.min(fieldBounds.width - 15, 
      (touch.clientX - rect.left) * scaleX - dragStart.x));
    const newY = Math.max(25, Math.min(fieldBounds.height - 25, 
      (touch.clientY - rect.top) * scaleY - dragStart.y));
    
    onMove(playerData.id, { x: newX, y: newY });
  }, [isDragging, dragStart, onMove, playerData.id, fieldBounds]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={playerData.x}
          cy={playerData.y}
          r="18"
          fill="none"
          stroke="#FBBF24"
          strokeWidth="3"
          strokeDasharray="4,2"
        />
      )}
      
      {/* Player circle */}
      <circle
        cx={playerData.x}
        cy={playerData.y}
        r="12"
        fill={getPlayerColor(playerData.type)}
        stroke="#ffffff"
        strokeWidth="2"
        className="transition-all duration-200"
        style={{
          filter: isSelected ? 'brightness(1.2)' : 'none'
        }}
      />
      
      {/* Player label */}
      <text
        x={playerData.x}
        y={playerData.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="10"
        fontWeight="bold"
        pointerEvents="none"
      >
        {playerData.type}
      </text>
      
      {/* Position label below player */}
      <text
        x={playerData.x}
        y={playerData.y + 25}
        textAnchor="middle"
        fill="#374151"
        fontSize="8"
        fontWeight="500"
        pointerEvents="none"
      >
        {playerData.type}
      </text>
    </g>
  );
}

export default Player;
