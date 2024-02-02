import {useDroppable} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import './index.css'
import { useEffect, useState } from 'react';


export function Subidividable(props){
    const {attributes, listeners,setNodeRef} = useDraggable({id:props.id})



    return <div className="subdividable" ref={setNodeRef} {...listeners} {...attributes}><DraggableHandle id={2}></DraggableHandle></div>

}

export function DraggableHandle(handleProps){
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: handleProps.id,
      });
    return <div className="resizeHandle" ref={setNodeRef} {...listeners} {...attributes}></div>
}