import { ReactFlowInstance, Node, Edge } from 'reactflow';
import _ from 'lodash';
import NodeData from '../types/NodeData';
function debounce(
  func: { (flow: ReactFlowInstance): void },
  timeout = 300,
): { (): void } {
  let timer: any;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const InputNodes: string[] = ['Switch'];

export default function useEvaluate(): {
  (flowInstance: ReactFlowInstance | null): void;
} {
  return debounce((flowInstance: ReactFlowInstance | null) => {
    const nodes = flowInstance?.getNodes() ?? [];
    const edges = flowInstance?.getEdges()?.reverse() ?? [];

    const visitedNodes: { [name: string]: Node | undefined } = {};
    nodes.map((node: Node) => {
      if (InputNodes.indexOf(node.type ?? '') < 0) {
        const newNodeData: NodeData = {
          ...node.data,
        };
        if (node.data.in1) {
          const hasIn1Edge: Edge[] =
            edges.filter((edge: Edge) => {
              return edge.target === node.id && edge.targetHandle === 'in1';
            }) ?? [];
          if (hasIn1Edge.length === 0) {
            newNodeData.in1 = false;
          }
        }
        if (node.data.in2) {
          const hasIn2Edge: Edge[] =
            edges.filter((edge: Edge) => {
              return edge.target === node.id && edge.targetHandle === 'in2';
            }) ?? [];
          if (hasIn2Edge.length === 0) {
            newNodeData.in2 = false;
          }
        }

        node.data = newNodeData;
      }
      visitedNodes[node.id] = node;
    });

    for (const edge of edges) {
      const targetNode: Node | undefined = visitedNodes[edge.target];
      const sourceNode: Node | undefined = visitedNodes[edge.source];
      if (targetNode && sourceNode) {
        const newTargetNodeData: any = {
          ...targetNode.data,
        };
        newTargetNodeData[`${edge.targetHandle}`] =
          sourceNode.data[`${edge.sourceHandle}`];
        if (targetNode.type === 'And') {
          newTargetNodeData.out = newTargetNodeData.in1 && newTargetNodeData.in2;
        }
        if (targetNode.type === 'Or') {
          newTargetNodeData.out = newTargetNodeData.in1 || newTargetNodeData.in2;
        }
        targetNode.data = newTargetNodeData;
        visitedNodes[`${targetNode?.id}`] = targetNode;
      }
    }

    const nodeKeys: string[] = _.keys(visitedNodes);
    const updatedNodes: Node[] = [];
    nodeKeys.map((key: string) => {
      const node: Node | undefined = visitedNodes[key];
      if (node) {
        updatedNodes.push(node);
      }
      return null;
    });

    const finalNodes: Node[] = [...updatedNodes];
    flowInstance?.setNodes(finalNodes);

    const newEdges: Edge[] = edges.map((edge: Edge) => {
      const sourceNode: Node | undefined = visitedNodes[edge.source];
      if (sourceNode) {
        const newEdge: Edge = {
          ...edge,
          style: {
            stroke: sourceNode.data.out ? 'red' : undefined,
          },
          animated: sourceNode.data.out ? true : false,
          type: 'smoothstep',
        };
        return newEdge;
      } else {
        return edge;
      }
    });
    flowInstance?.setEdges(newEdges);
  }, 10);
}
