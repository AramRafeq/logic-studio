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
    const edges = flowInstance?.getEdges() ?? [];
    const iSolatedNodes: Node[] =
      nodes?.filter((node: Node) => {
        const nodeAsSource = edges?.filter((edge: Edge) => edge.source === node.id) ?? [];
        const nodeAsTarget = edges?.filter((edge: Edge) => edge.target === node.id) ?? [];
        return nodeAsSource.length + nodeAsTarget.length === 0;
      }) ?? [];
    /* 
      one solution is to traverse the edges and get every source and target 
      and get ins and outs the calculate based on gate type 
      for this needs explicit definition of inputs and outputs which later on we can scale to include n
      */
  }, 200);
}
