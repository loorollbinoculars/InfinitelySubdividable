import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import './index.css'

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined
  };

  
  return (
    <div ref={setNodeRef} className="droppable" style={style}>
      {props.children}
    </div>
  );
}