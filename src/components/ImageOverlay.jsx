import React from 'react';

function ImageOverlay({ 
  overlaySettings, 
  onSettingsChange, 
  isImportMode, 
  onToggleImportMode 
}) {
  const handleSliderChange = (setting, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [setting]: parseFloat(value)
    }));
  };

  const handleResetPosition = () => {
    onSettingsChange(prev => ({
      ...prev,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0
    }));
  };

  if (!isImportMode) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-yellow-800">
          📷 Import Mode Active
        </h4>
        <button
          onClick={onToggleImportMode}
          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Exit Import Mode
        </button>
      </div>
      
      <p className="text-sm text-yellow-700 mb-4">
        Adjust the reference image position and opacity, then drag players and assign routes to match your drawing.
      </p>
      
      <div className="space-y-4">
        {/* Opacity Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Opacity: {Math.round(overlaySettings.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={overlaySettings.opacity}
            onChange={(e) => handleSliderChange('opacity', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Scale Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Scale: {Math.round(overlaySettings.scale * 100)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={overlaySettings.scale}
            onChange={(e) => handleSliderChange('scale', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horizontal Position
            </label>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={overlaySettings.x}
              onChange={(e) => handleSliderChange('x', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vertical Position
            </label>
            <input
              type="range"
              min="-200"
              max="200"
              step="5"
              value={overlaySettings.y}
              onChange={(e) => handleSliderChange('y', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Rotation Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rotation: {overlaySettings.rotation}°
          </label>
          <input
            type="range"
            min="-45"
            max="45"
            step="1"
            value={overlaySettings.rotation}
            onChange={(e) => handleSliderChange('rotation', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            onClick={handleResetPosition}
            className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset Position & Scale
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageOverlay;
