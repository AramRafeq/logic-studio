import { NodeProps, useReactFlow, Node, Edge } from 'reactflow';
import NodeData from '../types/NodeData';
import SwitchData from '../types/SwitchData';
import useEvaluate from './useEvaluate';
export default function useUpdateNode(props: NodeProps): {
  (arg: NodeData | SwitchData): void;
} {
  const flowInstance = useReactFlow();
  const evaluate = useEvaluate();
  return (data): void => {
    const nodes: Node[] = flowInstance.getNodes();
    const mutatedNodes: Node[] = nodes.map((node: Node) => {
      if (node.id === props.id) {
        const newNode: Node = {
          ...node,
          data: {
            ...data,
          },
        };
        return newNode;
      }
      return node;
    });
    flowInstance.setNodes(mutatedNodes);

    if (props.type === 'Switch') {
      const edges = flowInstance.getEdges();
      const otherEdges: Edge[] = [];
      const filteredEdges: Edge[] = edges.filter((edge: Edge) => {
        const shouldSelect = edge.source === props.id;
        if (!shouldSelect) {
          otherEdges.push(edge);
        }
        return shouldSelect;
      });
      const out = data.out[0];
      const newEdges: Edge[] = filteredEdges.map((edge: Edge) => {
        const newEdge: Edge = {
          ...edge,
          style: {
            stroke: out ? 'red' : undefined,
          },
          animated: out ? true : false,
          type: 'smoothstep',
        };
        return newEdge;
      });

      flowInstance.setEdges([...otherEdges, ...newEdges]);
      evaluate(flowInstance);
    }
  };
}
