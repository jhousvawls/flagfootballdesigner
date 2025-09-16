import React, { useState, useCallback } from 'react';
import ControlsPanel from './ControlsPanel';
import Field from './Field';
import ImageUpload from './ImageUpload';
import ImageOverlay from './ImageOverlay';
import PlayerContextMenu from './PlayerContextMenu';
import useRouteBuilder, { Waypoint } from './RouteBuilder';

// Football route library - properly scaled to field dimensions (600x400px)
// Field playing area: ~360px height (excluding 20px end zones)
// Short routes: ~10-15% of field, Medium: ~15-25%, Long: ~25-35%
const ROUTE_LIBRARY = {
  basic: {
    hitch: { 
      name: '0 - Hitch', 
      points: [{x: 0, y: 0}, {x: 0, y: -40}], 
      distance: 'short',
      number: 0
    },
    slant: { 
      name: '1 - Slant', 
      points: [{x: 0, y: 0}, {x: 0, y: -30}, {x: 50, y: -45}], 
      distance: 'short',
      number: 1
    },
    out: { 
      name: '2 - Out', 
      points: [{x: 0, y: 0}, {x: 0, y: -60}, {x: 80, y: -60}], 
      distance: 'medium',
      number: 2
    },
    post: { 
      name: '3 - Post', 
      points: [{x: 0, y: 0}, {x: 0, y: -60}, {x: -80, y: -60}], 
      distance: 'medium',
      number: 3
    },
    corner: { 
      name: '4 - Corner', 
      points: [{x: 0, y: 0}, {x: 0, y: -70}, {x: 90, y: -110}], 
      distance: 'long',
      number: 4
    },
    fly: { 
      name: '5 - Fly', 
      points: [{x: 0, y: 0}, {x: 0, y: -120}], 
      distance: 'long',
      number: 5
    },
    curl: { 
      name: '6 - Curl', 
      points: [{x: 0, y: 0}, {x: 0, y: -70}, {x: 0, y: -50}], 
      distance: 'medium',
      number: 6
    }
  },
  advanced: {
    comeback: { name: 'Comeback', points: [{x: 0, y: 0}, {x: 0, y: -80}, {x: 0, y: -60}], distance: 'medium' },
    dig: { name: 'Dig', points: [{x: 0, y: 0}, {x: 0, y: -60}, {x: -80, y: -60}], distance: 'medium' },
    fade: { name: 'Fade', points: [{x: 0, y: 0}, {x: 30, y: -110}], distance: 'long' }
  }
};

// Play categories
const PLAY_CATEGORIES = [
  'Quick Hit',
  'Trick Play', 
  'Goal Line',
  'Red Zone',
  'Short Yardage',
  'Long Yardage',
  'Screen',
  'Running Play'
];

// Formation presets
const FORMATIONS = {
  underCenter: [
    { id: 'qb', type: 'QB', x: 300, y: 280, position: 'Quarterback' },
    { id: 'c', type: 'C', x: 300, y: 240, position: 'Center' },
    { id: 'rb', type: 'RB', x: 300, y: 320, position: 'Running Back' },
    { id: 'wr1', type: 'WR1', x: 180, y: 240, position: 'Wide Receiver 1' },
    { id: 'wr2', type: 'WR2', x: 420, y: 240, position: 'Wide Receiver 2' }
  ],
  shotgun: [
    { id: 'qb', type: 'QB', x: 300, y: 320, position: 'Quarterback' },
    { id: 'c', type: 'C', x: 300, y: 240, position: 'Center' },
    { id: 'rb', type: 'RB', x: 240, y: 300, position: 'Running Back' },
    { id: 'wr1', type: 'WR1', x: 180, y: 240, position: 'Wide Receiver 1' },
    { id: 'wr2', type: 'WR2', x: 420, y: 240, position: 'Wide Receiver 2' }
  ]
};

const DEFAULT_PLAYERS = FORMATIONS.underCenter;

function PlayDesigner({ onSavePlay, isLoading }) {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [routes, setRoutes] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [playDetails, setPlayDetails] = useState({
    name: '',
    description: '',
    category: 'Quick Hit',
    vsMan: '',
    vsZone: ''
  });

  // Import functionality state
  const [referenceImage, setReferenceImage] = useState(null);
  const [isImportMode, setIsImportMode] = useState(false);
  const [overlaySettings, setOverlaySettings] = useState({
    opacity: 0.5,
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);
  const [currentFormation, setCurrentFormation] = useState('underCenter');

  // Route builder state
  const [routeBuilder, setRouteBuilder] = useState(null);

  const handlePlayerMove = useCallback((playerId, newPosition) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, x: newPosition.x, y: newPosition.y }
        : player
    ));
  }, []);

  const handlePlayerClick = useCallback((playerId) => {
    setSelectedPlayerId(playerId);
  }, []);

  const handleRouteSelect = useCallback((routeKey, routeData) => {
    setSelectedRoute({ key: routeKey, ...routeData });
  }, []);

  const handleAssignRoute = useCallback(() => {
    if (selectedPlayerId && selectedRoute) {
      const player = players.find(p => p.id === selectedPlayerId);
      if (player) {
        const newRoute = {
          playerId: selectedPlayerId,
          routeType: selectedRoute.key,
          routeName: selectedRoute.name,
          points: selectedRoute.points.map(point => ({
            x: player.x + point.x,
            y: player.y + point.y
          }))
        };
        
        setRoutes(prev => {
          // Remove existing route for this player
          const filtered = prev.filter(route => route.playerId !== selectedPlayerId);
          return [...filtered, newRoute];
        });
      }
    }
  }, [selectedPlayerId, selectedRoute, players]);

  const handleClearField = useCallback(() => {
    setPlayers(DEFAULT_PLAYERS);
    setRoutes([]);
    setSelectedPlayerId(null);
    setSelectedRoute(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!playDetails.name.trim()) {
      alert('Please enter a play name');
      return;
    }

    const playData = {
      ...playDetails,
      players: players,
      routes: routes
    };

    onSavePlay(playData);
    
    // Reset form
    setPlayDetails({
      name: '',
      description: '',
      category: 'Quick Hit',
      vsMan: '',
      vsZone: ''
    });
    handleClearField();
    
    alert('Play saved successfully!');
  }, [playDetails, players, routes, onSavePlay, handleClearField]);

  // Import functionality handlers
  const handleImageUpload = useCallback((imageData) => {
    setReferenceImage(imageData);
    setIsImportMode(true);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setReferenceImage(null);
    setIsImportMode(false);
    setOverlaySettings({
      opacity: 0.5,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    });
  }, []);

  const handleToggleImportMode = useCallback(() => {
    setIsImportMode(prev => !prev);
  }, []);

  // Context menu handlers
  const handlePlayerContextMenu = useCallback((playerId, position) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setContextMenu({
        playerId,
        player,
        position
      });
    }
  }, [players]);

  const handleContextMenuRouteSelect = useCallback((routeKey, routeData) => {
    if (contextMenu) {
      const player = players.find(p => p.id === contextMenu.playerId);
      if (player) {
        // Make routes field-position aware
        const fieldCenter = 300; // Center of 600px field
        const isPlayerOnLeft = player.x < fieldCenter;
        
        let adjustedPoints = [...routeData.points];
        
        // Adjust routes based on field position
        if (routeKey === 'post') {
          // Post routes always go toward center
          adjustedPoints = routeData.points.map((point, index) => {
            if (index === 0) return point; // Keep starting point
            if (index === routeData.points.length - 1) {
              // Last point goes toward center
              const direction = isPlayerOnLeft ? Math.abs(point.x) : -Math.abs(point.x);
              return { ...point, x: direction };
            }
            return point;
          });
        } else if (routeKey === 'out') {
          // Out routes always go toward sideline
          adjustedPoints = routeData.points.map((point, index) => {
            if (index === 0) return point; // Keep starting point
            if (index === routeData.points.length - 1) {
              // Last point goes toward sideline
              const direction = isPlayerOnLeft ? -Math.abs(point.x) : Math.abs(point.x);
              return { ...point, x: direction };
            }
            return point;
          });
        } else if (routeKey === 'corner') {
          // Corner routes go toward corner of field
          adjustedPoints = routeData.points.map((point, index) => {
            if (index === 0) return point; // Keep starting point
            if (index === routeData.points.length - 1) {
              // Last point goes toward corner
              const direction = isPlayerOnLeft ? -Math.abs(point.x) : Math.abs(point.x);
              return { ...point, x: direction };
            }
            return point;
          });
        } else if (routeKey === 'slant') {
          // Slant routes go toward center
          adjustedPoints = routeData.points.map((point, index) => {
            if (index === 0) return point; // Keep starting point
            if (point.x !== 0) {
              const direction = isPlayerOnLeft ? Math.abs(point.x) : -Math.abs(point.x);
              return { ...point, x: direction };
            }
            return point;
          });
        }

        const newRoute = {
          playerId: contextMenu.playerId,
          routeType: routeKey,
          routeName: routeData.name,
          points: adjustedPoints.map(point => ({
            x: player.x + point.x,
            y: player.y + point.y
          }))
        };
        
        setRoutes(prev => {
          const filtered = prev.filter(route => route.playerId !== contextMenu.playerId);
          return [...filtered, newRoute];
        });
      }
    }
  }, [contextMenu, players]);

  const handleContextMenuClearRoute = useCallback(() => {
    if (contextMenu) {
      setRoutes(prev => prev.filter(route => route.playerId !== contextMenu.playerId));
    }
  }, [contextMenu]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Formation handlers
  const handleFormationChange = useCallback((formationType) => {
    setCurrentFormation(formationType);
    setPlayers(FORMATIONS[formationType]);
    setRoutes([]);
    setSelectedPlayerId(null);
    setSelectedRoute(null);
  }, []);

  // Route builder handlers
  const handleBuildCustomRoute = useCallback(() => {
    if (contextMenu) {
      const player = players.find(p => p.id === contextMenu.playerId);
      if (player) {
        const existingRoute = routes.find(r => r.playerId === contextMenu.playerId);
        
        // Set route builder config - the hook will be called in the component that uses it
        setRouteBuilder({
          playerId: contextMenu.playerId,
          playerPosition: { x: player.x, y: player.y },
          existingRoute,
          onRouteUpdate: handleRouteBuilderUpdate,
          onRouteComplete: handleRouteBuilderComplete,
          onCancel: handleRouteBuilderCancel
        });
        
        setContextMenu(null);
      }
    }
  }, [contextMenu, players, routes]);

  const handleRouteBuilderUpdate = useCallback((routeData) => {
    setRoutes(prev => {
      const filtered = prev.filter(route => route.playerId !== routeData.playerId);
      return [...filtered, routeData];
    });
  }, []);

  const handleRouteBuilderComplete = useCallback((routeData) => {
    setRoutes(prev => {
      const filtered = prev.filter(route => route.playerId !== routeData.playerId);
      return [...filtered, routeData];
    });
    setRouteBuilder(null);
  }, []);

  const handleRouteBuilderCancel = useCallback(() => {
    setRouteBuilder(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Play Details Section */}
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
              onChange={(e) => setPlayDetails(prev => ({ ...prev, name: e.target.value }))}
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
              onChange={(e) => setPlayDetails(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PLAY_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formation Selection */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Formation</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleFormationChange('underCenter')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentFormation === 'underCenter'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100'
            }`}
          >
            Under Center
          </button>
          <button
            onClick={() => handleFormationChange('shotgun')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentFormation === 'shotgun'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-100'
            }`}
          >
            Shotgun
          </button>
        </div>
      </div>

      {/* Image Overlay Controls */}
      <ImageOverlay
        overlaySettings={overlaySettings}
        onSettingsChange={setOverlaySettings}
        isImportMode={isImportMode}
        onToggleImportMode={handleToggleImportMode}
      />
      
      {/* Football Field - Now at the top of the design area */}
      <div className="relative">
        <Field
          players={players}
          routes={routes}
          selectedPlayerId={selectedPlayerId}
          onPlayerMove={handlePlayerMove}
          onPlayerClick={handlePlayerClick}
          onPlayerContextMenu={handlePlayerContextMenu}
          referenceImage={referenceImage}
          overlaySettings={overlaySettings}
          routeBuilderConfig={routeBuilder}
        />
        
        {/* Context Menu */}
        {contextMenu && (
          <PlayerContextMenu
            player={contextMenu.player}
            position={contextMenu.position}
            routeLibrary={ROUTE_LIBRARY}
            onRouteSelect={handleContextMenuRouteSelect}
            onClearRoute={handleContextMenuClearRoute}
            onBuildCustomRoute={handleBuildCustomRoute}
            onClose={handleCloseContextMenu}
            hasRoute={routes.some(route => route.playerId === contextMenu.playerId)}
          />
        )}
      </div>

      {/* Simplified Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleClearField}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear Field
        </button>
        
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Play
        </button>
      </div>

      {/* Additional Play Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Strategy Notes</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={playDetails.description}
              onChange={(e) => setPlayDetails(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Brief description of the play"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                vs. Man Defense
              </label>
              <textarea
                value={playDetails.vsMan}
                onChange={(e) => setPlayDetails(prev => ({ ...prev, vsMan: e.target.value }))}
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
                onChange={(e) => setPlayDetails(prev => ({ ...prev, vsZone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Strategy against zone coverage"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Import from Drawing Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Import from Hand Drawing</h3>
        <ImageUpload
          onImageUpload={handleImageUpload}
          currentImage={referenceImage}
          onRemoveImage={handleRemoveImage}
        />
      </div>
    </div>
  );
}

export default PlayDesigner;
