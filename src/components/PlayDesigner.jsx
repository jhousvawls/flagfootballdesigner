import React, { useState, useCallback } from 'react';
import ControlsPanel from './ControlsPanel';
import Field from './Field';

// Predefined route library
const ROUTE_LIBRARY = {
  short: {
    slant: { name: 'Slant', points: [{x: 0, y: 0}, {x: 15, y: -10}], distance: 'short' },
    quickOut: { name: 'Quick Out', points: [{x: 0, y: 0}, {x: 0, y: -8}, {x: 15, y: -8}], distance: 'short' },
    hitch: { name: 'Hitch', points: [{x: 0, y: 0}, {x: 0, y: -12}, {x: 0, y: -8}], distance: 'short' },
    screen: { name: 'Screen', points: [{x: 0, y: 0}, {x: -5, y: 2}, {x: 10, y: 5}], distance: 'short' },
    pop: { name: 'Pop', points: [{x: 0, y: 0}, {x: 0, y: -8}], distance: 'short' }
  },
  medium: {
    comeback: { name: 'Comeback', points: [{x: 0, y: 0}, {x: 0, y: -18}, {x: 0, y: -12}], distance: 'medium' },
    dig: { name: 'Dig', points: [{x: 0, y: 0}, {x: 0, y: -15}, {x: -20, y: -15}], distance: 'medium' },
    post: { name: 'Post', points: [{x: 0, y: 0}, {x: 0, y: -12}, {x: -15, y: -20}], distance: 'medium' },
    corner: { name: 'Corner', points: [{x: 0, y: 0}, {x: 0, y: -12}, {x: 15, y: -20}], distance: 'medium' },
    deepOut: { name: 'Deep Out', points: [{x: 0, y: 0}, {x: 0, y: -18}, {x: 20, y: -18}], distance: 'medium' }
  },
  long: {
    go: { name: 'Go/Streak', points: [{x: 0, y: 0}, {x: 0, y: -30}], distance: 'long' },
    deepPost: { name: 'Deep Post', points: [{x: 0, y: 0}, {x: 0, y: -20}, {x: -20, y: -35}], distance: 'long' },
    deepCorner: { name: 'Deep Corner', points: [{x: 0, y: 0}, {x: 0, y: -20}, {x: 25, y: -35}], distance: 'long' },
    fade: { name: 'Fade', points: [{x: 0, y: 0}, {x: 8, y: -30}], distance: 'long' }
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

// Default player positions for 5v5 formation
const DEFAULT_PLAYERS = [
  { id: 'qb', type: 'QB', x: 300, y: 280, position: 'Quarterback' },
  { id: 'c', type: 'C', x: 300, y: 240, position: 'Center' },
  { id: 'rb', type: 'RB', x: 300, y: 320, position: 'Running Back' },
  { id: 'wr1', type: 'WR1', x: 180, y: 240, position: 'Wide Receiver 1' },
  { id: 'wr2', type: 'WR2', x: 420, y: 240, position: 'Wide Receiver 2' }
];

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

  return (
    <div className="space-y-6">
      <ControlsPanel
        playDetails={playDetails}
        onPlayDetailsChange={setPlayDetails}
        routeLibrary={ROUTE_LIBRARY}
        playCategories={PLAY_CATEGORIES}
        selectedRoute={selectedRoute}
        selectedPlayer={selectedPlayerId}
        onRouteSelect={handleRouteSelect}
        onAssignRoute={handleAssignRoute}
        onClearField={handleClearField}
        onSave={handleSave}
      />
      
      <Field
        players={players}
        routes={routes}
        selectedPlayerId={selectedPlayerId}
        onPlayerMove={handlePlayerMove}
        onPlayerClick={handlePlayerClick}
      />
    </div>
  );
}

export default PlayDesigner;
