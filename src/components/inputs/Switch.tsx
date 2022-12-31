import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

export default function Switch(): React.ReactElement {
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
          height={60}
          src={power ? '/images/switch/on.jpg' : '/images/switch/off.jpg'}
          alt="switch"
        />
      </button>
      <Handle type="source" position={Position.Right} id="b" style={handleStyle} />
    </>
  );
}
