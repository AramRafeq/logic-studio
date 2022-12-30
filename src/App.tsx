import './App.css';
import React, { useCallback } from 'react';
import ReactFlow, { Background, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import Switch from './components/inputs/Switch';

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: {
      label: 'First Node',
      name: 'Custom Name',
    },
    type: 'Switch',
  },
];

const initialEdges: any = [];
const nodeTypes = {
  Switch: Switch,
};
export default function Flow(): React.ReactElement {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
