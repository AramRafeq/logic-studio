import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function And(): React.ReactElement {
  const [power, setPower] = useState(false);
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
