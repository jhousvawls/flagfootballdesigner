import React from 'react';
import useRouteBuilder, { Waypoint } from './RouteBuilder';

function RouteBuilderComponent({ 
  routeBuilderConfig, 
  onFieldClick, 
  onWaypointDrag, 
  onWaypointRemove 
}) {
  const routeBuilder = useRouteBuilder(routeBuilderConfig);

  // Pass the handlers up to parent
  React.useEffect(() => {
    if (onFieldClick) onFieldClick(routeBuilder.handleFieldClick);
    if (onWaypointDrag) onWaypointDrag(routeBuilder.handleWaypointDrag);
    if (onWaypointRemove) onWaypointRemove(routeBuilder.handleRemoveWaypoint);
  }, [routeBuilder, onFieldClick, onWaypointDrag, onWaypointRemove]);

  return {
    waypoints: routeBuilder.waypoints,
    isBuilding: routeBuilder.isBuilding,
    handleComplete: routeBuilder.handleComplete,
    handleCancel: routeBuilder.handleCancel
  };
}

export default RouteBuilderComponent;
