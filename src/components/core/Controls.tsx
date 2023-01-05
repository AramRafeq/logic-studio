import React from 'react';
import './Controls.css';

export default function Controls(): React.ReactElement {
  const onDragStart: any = (event: any, nodeType: string): void => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <button
        className="control"
        onDragStart={(event: any): void => onDragStart(event, 'Switch')}
        draggable
      >
        <img alt="" src="/images/switch/off.jpg" width={35} />
        <br />
        Switch
      </button>
      <button
        className="control"
        onDragStart={(event: any): void => onDragStart(event, 'And')}
        draggable
      >
        <img alt="" src="/images/gates/and.png" width={80} />
        <br />
        And Gate
      </button>
      <button
        className="control"
        onDragStart={(event: any): void => onDragStart(event, 'Or')}
        draggable
      >
        <img alt="" src="/images/gates/or.png" width={80} />
        <br />
        Or Gate
      </button>
    </aside>
  );
}
