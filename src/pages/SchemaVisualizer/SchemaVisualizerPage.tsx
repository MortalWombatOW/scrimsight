import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  Controls,
  Background,
  Panel,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Layout } from "~/components/Layout/Layout";
import AtomNode from "./components/AtomNode";
import EdgeLabel from "./components/EdgeLabel";
import { getLayoutedElements } from "./utils/dagre";
import { useAtomData } from "./hooks/useAtomData";
import LayerSelector from "./components/LayerSelector";

const SchemaVisualizerPage: React.FC = () => {
  const {
    nodes: initialNodes,
    edges,
    selectedLayers,
    setSelectedLayers,
  } = useAtomData();
  const [
    reactFlowInstance,
    setReactFlowInstance,
  ] = useState<ReactFlowInstance | null>(null);
  const [direction, setDirection] = useState<"LR" | "TB">("LR");

  // Apply layout to initial nodes
  const [nodes, setNodes] = useState(() => {
    if (!initialNodes) return null;
    const { nodes: layoutedNodes } = getLayoutedElements(
      initialNodes,
      edges || [],
      direction
    );
    return layoutedNodes;
  });

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      atomNode: AtomNode,
    }),
    []
  );

  const edgeTypes = useMemo<EdgeTypes>(
    () => ({
      custom: EdgeLabel,
    }),
    []
  );

  // Update nodes when selected layers or direction change
  useEffect(() => {
    if (!initialNodes || !edges) return;
    const { nodes: layoutedNodes } = getLayoutedElements(
      initialNodes,
      edges,
      direction
    );
    setNodes(layoutedNodes);
  }, [initialNodes, edges, selectedLayers, direction]);

  const onLayout = useCallback(() => {
    if (!initialNodes || !edges) return;

    // Apply layout algorithm
    const { nodes: layoutedNodes } = getLayoutedElements(
      initialNodes,
      edges,
      direction
    );

    // Update state and view
    setNodes(layoutedNodes);

    if (reactFlowInstance) {
      // Center view on the graph
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 50);
    }
  }, [initialNodes, edges, reactFlowInstance, direction]);

  if (!nodes || !edges) {
    return <div>Loading atom data...</div>;
  }

  return (
    <Layout>
      <div style={{ height: "calc(100vh - 64px)", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: "custom",
          }}
          defaultMarkerColor="#888"
          defaultViewport={{ zoom: 0.8, x: 0, y: 0 }}
          minZoom={0.2}
          maxZoom={2}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#f0f0f0" variant={BackgroundVariant.Dots} />
          <Controls />
          <Panel position="top-left">
            <LayerSelector
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              direction={direction}
              setDirection={setDirection}
              onLayout={onLayout}
            />
          </Panel>
        </ReactFlow>
      </div>
    </Layout>
  );
};

export default SchemaVisualizerPage;
