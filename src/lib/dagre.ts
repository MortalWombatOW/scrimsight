import { Node, Edge } from 'reactflow';
import dagre from 'dagre';

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = 'LR', // LR = left-right, TB = top-bottom
) => {
  // Create a new dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  
  // Configure the layout algorithm
  g.setGraph({ 
    rankdir: direction,
    nodesep: 120,     // Increased space between nodes horizontally
    ranksep: 150,     // Increased space between ranks (levels)
    edgesep: 80,      // Minimum separation between edge graphics
    marginx: 50,      // Margin along X
    marginy: 50,      // Margin along Y
    acyclicer: 'greedy', // Use greedy method to resolve cycles
    ranker: 'network-simplex' // Use network simplex algorithm
  });

  // Set nodes with accurate size estimations
  nodes.forEach((node) => {
    // Calculate height based on number of fields
    const fieldCount = node.data?.fields?.length || 0;
    const nodeHeight = Math.max(120, 120 + fieldCount * 25); // Increased spacing per field
    const nodeWidth = 240;
    
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Set edges with their source and target
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target, {
      weight: 1, // Default weight
    });
  });

  // Run the layout algorithm
  dagre.layout(g);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    
    // Skip nodes that dagre couldn't layout
    if (!nodeWithPosition) {
      return node;
    }
    
    return {
      ...node,
      position: {
        // Center the node on the calculated position
        x: nodeWithPosition.x - (nodeWithPosition.width / 2),
        y: nodeWithPosition.y - (nodeWithPosition.height / 2),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
