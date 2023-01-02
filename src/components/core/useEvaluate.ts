import { ReactFlowInstance } from 'reactflow';
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
export default function useEvaluate(): {
  (flowInstance: ReactFlowInstance | null): void;
} {
  //   const updateNodeHandler = useUpdateNode();
  return debounce((flowInstance: ReactFlowInstance | null) => {
    const nodes = flowInstance?.getNodes();
    const edges = flowInstance?.getEdges();
    const updatedNodes: Node[] = [];
    console.log(edges);
  }, 200);
}
