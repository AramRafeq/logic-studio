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
      //func.apply(this, args);
    }, timeout);
  };
}

function calculateNodeStates(node: Node, nodeData: NodeData, edges: Edge[]): void {
  if (node.type === 'And') {
    nodeData.out = nodeData.in1 && nodeData.in2;
  }
  if (node.type === 'Or') {
    nodeData.out = nodeData.in1 || nodeData.in2;
  }
  if (node.type === 'Not') {
    nodeData.out = !nodeData.in1;
    const nodeEdges = edges.filter((edge: Edge) => edge.target === node.id) ?? [];
    if (nodeEdges.length === 0) nodeData.out = false;
  }
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
          rank: -1,
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
      } else {
        node.data.rank = 0;
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
        calculateNodeStates(targetNode, newTargetNodeData, edges);
        targetNode.data = newTargetNodeData;
        visitedNodes[`${targetNode?.id}`] = targetNode;
      }
    }

    const nodeKeys: string[] = _.keys(visitedNodes);
    const updatedNodes: Node[] = [];
    nodeKeys.map((key: string) => {
      const node: Node | undefined = visitedNodes[key];
      if (node) {
        const newNodeData: NodeData = {
          ...node.data,
        };
        calculateNodeStates(node, newNodeData, edges);
        node.data = newNodeData;
        updatedNodes.push(node);
      }
      return null;
    });

    const finalNodes: Node[] = [...updatedNodes];
    console.log(finalNodes);
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
