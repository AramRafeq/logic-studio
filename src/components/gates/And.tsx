import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export default function And(props: NodeProps): React.ReactElement {
  const in1 = props.data.in.length > 0 ? props.data.in[0] : false;
  const in2 = props.data.in.length > 0 ? props.data.in[1] : false;
  const out = props.data.out.length > 0 ? props.data.out[0] : false;
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
      </button>

      <Handle
        type="target"
        position={Position.Left}
        id="in-1"
        style={{ top: 14, left: 3, background: in1 ? 'red' : undefined }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in-2"
        style={{ top: 38, left: 3, background: in2 ? 'red' : undefined }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out-1"
        style={{
          right: 5,
          top: 26,
          background: out ? 'red' : undefined,
        }}
      />
    </>
  );
}
