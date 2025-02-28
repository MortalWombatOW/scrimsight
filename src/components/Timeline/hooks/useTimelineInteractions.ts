import { useCallback, useRef } from 'react';
import * as THREE from 'three';

interface TimelineInteractionsProps {
  container: React.RefObject<HTMLDivElement>;
  camera: React.RefObject<THREE.OrthographicCamera | null>;
  scene: React.RefObject<THREE.Scene | null>;
  eventMarkers: React.RefObject<Map<string, THREE.Object3D>>;
  onSelect: (eventIds: string[]) => void;
}

/**
 * Custom hook for handling interactions with the THREE.js timeline
 */
export function useTimelineInteractions({
  container,
  camera,
  scene,
  eventMarkers,
  onSelect
}: TimelineInteractionsProps) {
  // Raycaster for mouse interaction
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  
  // Track currently hovered objects
  const hoveredObject = useRef<THREE.Object3D | null>(null);
  
  // Initialize interaction handling
  const initializeInteractions = useCallback(() => {
    if (!container.current) return;
    
    const containerElement = container.current;
    
    // Mouse move handler for hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerElement || !camera.current || !scene.current) return;
      
      // Calculate mouse position in normalized device coordinates
      const rect = containerElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / containerElement.clientWidth) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / containerElement.clientHeight) * 2 + 1;
      
      // Update the raycaster
      raycaster.current.setFromCamera(mouse.current, camera.current);
      
      // Find intersections with objects that have event data
      const intersects = raycaster.current.intersectObjects(
        Array.from(eventMarkers.current?.values() || [])
      );
      
      // Handle hover effects
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        // If hovering over a new object
        if (hoveredObject.current !== intersectedObject) {
          // Reset previous hover effect
          if (hoveredObject.current && hoveredObject.current instanceof THREE.Mesh) {
            hoveredObject.current.scale.set(1, 1, 1);
          }
          
          // Apply new hover effect
          hoveredObject.current = intersectedObject;
          if (intersectedObject instanceof THREE.Mesh) {
            intersectedObject.scale.set(1.2, 1.2, 1.2);
          }
          
          // Change cursor to indicate interactive element
          containerElement.style.cursor = 'pointer';
        }
      } else {
        // Reset hover effect when not hovering over any object
        if (hoveredObject.current && hoveredObject.current instanceof THREE.Mesh) {
          hoveredObject.current.scale.set(1, 1, 1);
        }
        hoveredObject.current = null;
        containerElement.style.cursor = 'default';
      }
    };
    
    // Click handler for object selection
    const handleClick = (event: MouseEvent) => {
      if (!containerElement || !camera.current || !scene.current) return;
      
      // Calculate mouse position
      const rect = containerElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / containerElement.clientWidth) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / containerElement.clientHeight) * 2 + 1;
      
      // Update the raycaster
      raycaster.current.setFromCamera(mouse.current, camera.current);
      
      // Find intersections
      const intersects = raycaster.current.intersectObjects(
        Array.from(eventMarkers.current?.values() || [])
      );
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        // Find the event ID associated with the object
        let selectedEventId: string | null = null;
        
        for (const [id, object] of eventMarkers.current?.entries() || []) {
          if (object === intersectedObject) {
            selectedEventId = id;
            break;
          }
        }
        
        if (selectedEventId) {
          // If shift key is pressed, add to selection, otherwise replace
          const multiSelect = event.shiftKey;
          
          if (multiSelect) {
            // Get currently selected events from component state
            // For simplicity, we're not tracking this in the hook
            // The component will need to handle this state
            onSelect([selectedEventId]);
          } else {
            onSelect([selectedEventId]);
          }
        }
      } else {
        // Clear selection when clicking empty space
        onSelect([]);
      }
    };
    
    // Add event listeners
    containerElement.addEventListener('mousemove', handleMouseMove);
    containerElement.addEventListener('click', handleClick);
    
    // Cleanup function
    return () => {
      containerElement.removeEventListener('mousemove', handleMouseMove);
      containerElement.removeEventListener('click', handleClick);
    };
  }, [camera, container, eventMarkers, onSelect, scene]);
  
  // Update raycasting objects when event markers change
  const updateInteractions = useCallback(() => {
    // Nothing specific needed here for now
    // This function could be expanded to update any data structures
    // that are needed for interaction handling
  }, []);
  
  return {
    initializeInteractions,
    updateInteractions
  };
} 