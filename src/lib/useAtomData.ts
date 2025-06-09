import { useEffect, useState, useMemo } from 'react';
import { MarkerType, Edge as ReactFlowEdge, Node as ReactFlowNode } from 'reactflow';
import type { AtomCollection } from '@library';
import { getAtomData } from '@library';

export const useAtomData = () => {
  const [atomData, setAtomData] = useState<AtomCollection | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['data', 'derived_state', 'metrics']);
  
  useEffect(() => {
    // Fetch atom data
    const fetchData = async () => {
      const data = await getAtomData();
      setAtomData(data);
    };
    
    fetchData();
  }, []);
  
  // Filter nodes based on selected layers
  const nodes = useMemo<ReactFlowNode[] | null>(() => {
    if (!atomData) return null;
    
    return atomData.atoms
      .filter(atom => selectedLayers.includes(atom.layer))
      .map(atom => ({
        id: atom.id,
        type: 'atomNode',
        position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
        data: atom,
      }));
  }, [atomData, selectedLayers]);
  
  // Create edges from dependencies
  const edges = useMemo<ReactFlowEdge[] | null>(() => {
    if (!atomData || !nodes) return null;
    
    // Get list of visible atom IDs
    const visibleAtomIds = nodes.map(node => node.id);
    
    // Create edges only between visible atoms
    return atomData.dependencies
      .filter(
        dep => 
          visibleAtomIds.includes(dep.sourceAtom) && 
          visibleAtomIds.includes(dep.targetAtom)
      )
      .map((dep, index) => ({
        id: `edge-${index}`,
        source: dep.sourceAtom,
        target: dep.targetAtom,
        sourceHandle: `output-${dep.sourceField}`,
        targetHandle: `input-${dep.targetField}`,
        label: dep.label || '',
        type: 'custom',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#888',
        },
        style: {
          strokeWidth: 1,
          stroke: '#888',
        },
      }));
  }, [atomData, nodes]);
  
  return { atoms: atomData?.atoms || [], nodes, edges, selectedLayers, setSelectedLayers };
};
