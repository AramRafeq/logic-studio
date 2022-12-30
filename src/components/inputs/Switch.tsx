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
export default function Switch(props: ComponentProps): React.ReactElement {
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
        <img
          height={50}
          src={power ? '/images/switch/on.jpg' : '/images/switch/off.jpg'}
          alt="switch"
        />
      </button>
      {/* <pre>{JSON.stringify(props)}</pre> */}
      <Handle type="source" position={Position.Right} id="b" style={handleStyle} />
    </>
  );
}
