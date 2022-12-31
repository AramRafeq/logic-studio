import './App.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Edge,
  Connection,
  ReactFlowProvider,
  BackgroundVariant,
  ReactFlowInstance,
  useKeyPress,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Switch from './components/inputs/Switch';
import And from './components/gates/And';
import Controls from './components/core/Controls';
const initialNodes = [
  // {
  //   id: '1',
  //   position: { x: 100, y: 100 },
  //   data: {
  //     label: 'First Node',
  //     name: 'Custom Name',
  //   },
  //   type: 'Switch',
  // },
  // {
  //   id: '2',
  //   position: { x: 200, y: 200 },
  //   data: {
  //     label: 'First Node',
  //     name: 'Custom Name',
  //   },
  //   type: 'And',
  // },
];

const initialEdges: Edge[] = [];
const nodeTypes = {
  Switch: Switch,
  And: And,
};
let id = 0;
const getId = (): string => `dndnode_${id++}`;

export default function Flow(): React.ReactElement {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const DeletePressed = useKeyPress('Delete');
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(
    null,
  );

  const edgeUpdateSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLInputElement>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        type: 'smoothstep',
        style: {
          // stroke: 'red',
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);
  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);
  const onEdgeUpdateEnd = useCallback((_: MouseEvent, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (reactFlowInstance && reactFlowWrapper.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode: any = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node` },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance],
  );

  useEffect(() => {
    setNodes((nds) => nds.filter((node) => node.selected == undefined));
  }, [DeletePressed]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <ReactFlowProvider>
        <div className="reactflow-wrapper" style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            snapToGrid
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            // fitView
            attributionPosition="top-right"
            onInit={(a: any): void => setReactFlowInstance(a)}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background variant={BackgroundVariant.Lines} />
          </ReactFlow>
        </div>
        <Controls />
      </ReactFlowProvider>
    </div>
  );
}
