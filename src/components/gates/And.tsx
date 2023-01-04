import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export default function And(props: NodeProps): React.ReactElement {
  const in1 = props.data.in1;
  const in2 = props.data.in2;
  const out = props.data.out;
  return (
    <>
      <button
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <img height={50} src="/images/gates/and.png" alt="And" />
        <br />
        {props.id}
      </button>

      <Handle
        type="target"
        position={Position.Left}
        id="in1"
        style={{ top: 14, left: 3, background: in1 ? 'red' : undefined }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in2"
        style={{ top: 38, left: 3, background: in2 ? 'red' : undefined }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          right: 5,
          top: 26,
          background: out ? 'red' : undefined,
        }}
      />
    </>
  );
}
