import { ReactFlowInstance, Node, Edge } from 'reactflow';
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
    const edges = flowInstance?.getEdges() ?? [];
    const iSolatedNodes: Node[] =
      nodes?.filter((node: Node) => {
        const nodeAsSource = edges?.filter((edge: Edge) => edge.source === node.id) ?? [];
        const nodeAsTarget = edges?.filter((edge: Edge) => edge.target === node.id) ?? [];
        return nodeAsSource.length + nodeAsTarget.length === 0;
      }) ?? [];

    let visitedNodesCount = 0;
    const visitedEdges: string[] = [];
    const visitedNodes: { [name: string]: Node } = {};

    const inputNodes: Node[] =
      nodes?.filter((node: Node) => InputNodes.indexOf(`${node.type}`) > -1) ?? [];
    const layer: Node[] = inputNodes;
    const nextLayer: Node[] = [];

    while (visitedNodesCount < nodes.length - iSolatedNodes.length) {
      for (const node of layer ?? []) {
        if (!visitedNodes[node.id]) {
          console.log(node);
          visitedNodes[node.id] = node;
        } else {
          console.log('visited node found');
        }
        visitedNodesCount += 1;
      }
      console.log('evaluation loop');
    }
    // const updatedNodes: Node[] = nodes?.map((node: Node) => {
    //   if (node.type === 'And') {
    //     const nData: NodeData = {
    //       ...node.data,
    //       in: [],
    //       out: [],
    //     };
    //     const mutatedNode: Node = {
    //       ...node,
    //       data: nData,
    //     };
    //     return mutatedNode;
    //   }
    //   return node;
    // });
    // console.log(nodes);
  }, 200);
}
