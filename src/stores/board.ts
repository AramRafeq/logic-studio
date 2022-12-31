import create from 'zustand';
import { Node, Connection } from 'reactflow';
interface BoardStore {
  nodes: Node[];
  connections: Connection[];
}
const useBoardStore = create((set): object => {
  const Board: BoardStore = {
    nodes: [],
    connections: [],
  };
  return Board;
});

export default useBoardStore;
