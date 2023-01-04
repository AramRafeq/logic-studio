import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import NodeData from '../types/NodeData';
import useUpdateNode from '../core/useUpdateNode';
export default function Switch(props: NodeProps): React.ReactElement {
  const updateHandler = useUpdateNode(props);
  const [power, setPower] = useState(false);
  const handleStyle = {
    background: power ? 'red' : 'black',
  };
  const togglePower = (): void => {
    setPower((v) => !v);
  };

  useEffect(() => {
    const newData: NodeData = {
      ...props.data,
      out: power,
    };
    updateHandler(newData);
  }, [power]);

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
      <Handle type="source" position={Position.Right} id="out" style={handleStyle} />
    </>
  );
}
