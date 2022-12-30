import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
export default function Switch(props): React.ReactElement {
  const handleStyle = {};
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
