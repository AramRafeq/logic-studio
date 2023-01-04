import { ReactFlowInstance, Node, Edge } from 'reactflow';
import _ from 'lodash';
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
    const groupedEdgesByTarget: { [name: string]: Edge[] } = _.groupBy(edges, 'target');
    const groupedEdgesByTargetKeys = _.sortBy(_.keys(groupedEdgesByTarget), (o: string) =>
      parseInt(o),
    );
    console.log(groupedEdgesByTargetKeys);
    console.log(groupedEdgesByTarget);
    const visitedNodes: { [name: string]: Node | undefined } = {};
    nodes.map((node: Node) => {
      visitedNodes[node.id] = node;
    });

    for (const nodeKey of groupedEdgesByTargetKeys) {
      const groupedEdges: Edge[] = groupedEdgesByTarget[nodeKey];
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
          targetNode.data = newTargetNodeData;
          visitedNodes[`${targetNode?.id}`] = targetNode;
        }
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
  }, 10);
}
