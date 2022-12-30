import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
interface ComponentProps {
  id: string;
  data: object;
  type: string;
  xPos: number;
  yPos: number;
  zIndex: number;
  selected: boolean;
  sourcePosition: string;
  targetPosition: string;
  dragging: boolean;
  isConnectable: boolean;
  dragHandle: string;
}
export default function And(props: ComponentProps): React.ReactElement {
  const [power, setPower] = useState(false);
  const handleStyle = {
    background: power ? 'red' : 'black',
  };
  const togglePower = (): void => {
    setPower((v) => !v);
  };
  return (
    <>
      <button
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={togglePower}
      >
        <img height={50} src="/images/gates/and.png" alt="And" />
      </button>
      {/* <pre>{JSON.stringify(props)}</pre> */}
      {/* <Handle type="target" position={Position.Left} id="in-1" style={{ top: 0 }} /> */}
      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: 14, left: 3 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: 38, left: 3 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out-1"
        style={{
          right: 5,
          top: 26,
        }}
      />
    </>
  );
}
