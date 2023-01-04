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
  //   const updateNodeHandler = useUpdateNode();
  return debounce((flowInstance: ReactFlowInstance | null) => {
    const nodes = flowInstance?.getNodes() ?? [];
    const inputNodes: Node[] =
      nodes.filter((node: Node) => {
        return InputNodes.indexOf(node.type ?? '') > -1;
      }) ?? [];
    const edges = flowInstance?.getEdges() ?? [];
    const visitedNodes: { [name: string]: Node | undefined } = {};
    for (const edge of edges) {
      const targetNode: Node | undefined = flowInstance?.getNode(edge.target);
      const sourceNode: Node | undefined = flowInstance?.getNode(edge.source);
      let calculationNode: Node | undefined = targetNode;
      if (targetNode && sourceNode) {
        if (visitedNodes[targetNode.id]) {
          calculationNode = visitedNodes[targetNode.id];
        }
        const newTargetNodeData: any = {
          ...targetNode.data,
        };

        newTargetNodeData[`${edge.targetHandle}`] =
          sourceNode.data[`${edge.sourceHandle}`];
        if (targetNode.type === 'And') {
          newTargetNodeData['out'] = newTargetNodeData.in1 && newTargetNodeData.in2;
        }

        targetNode.data = newTargetNodeData;
        visitedNodes[`${calculationNode?.id}`] = calculationNode;
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
    const finalNodes: Node[] = [...updatedNodes, ...inputNodes];
    flowInstance?.setNodes(finalNodes);
  }, 10);
}
