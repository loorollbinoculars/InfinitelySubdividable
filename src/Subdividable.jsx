import {useDroppable} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import './index.css'
import { useEffect, useState } from 'react';


export function Subdividable(props){
    const {isOver, setNodeRef} = useDroppable({id:props.id})
    const {dims, setDims} = useState({})
    const {siblings, setSiblings} = useState([])

    useEffect(()=>{
        isOver
    },[isOver])

    return <div className="subdividable" ref={setNodeRef}><DraggableHandle id={2}></DraggableHandle></div>

}

export function DraggableHandle(handleProps){
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: handleProps.id,
      });
    return <div className="resizeHandle" ref={setNodeRef} {...listeners} {...attributes}></div>
}