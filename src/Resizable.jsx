import {useDroppable} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import './index.css'
import { useEffect, useState } from 'react';


export function Resizable(props){

    return <div className="resizable">
        <Third type="top" id={10} over={props.isOver}></Third>
        <Third type="middle" id={11} over={props.isOver}></Third>
        <Third type="bottom" id={12} over ={props.isOver}></Third>
        <DraggableHandle id={1}></DraggableHandle>
    </div>
}

export function Third(props){
    const {isOver, setNodeRef} = useDroppable({id:props.id})
    const [style, setStyle] = useState({});

    useEffect(()=>{
            setStyle({"visibility": (props.over==props.id) ? "visible": "hidden"})}, [isOver, props.id, props.over])
    
    return <div className={props.type + "Third"} ref={setNodeRef} style={style}></div>
}

export function DraggableHandle(handleProps){
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: handleProps.id,
      });
    return <div className="resizeHandle" ref={setNodeRef} {...listeners} {...attributes}></div>
}