import {useDroppable} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import './index.css'


export function Resizable(props){
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    })

    return <div className="resizable" ref={setNodeRef}>
        <div className="topThird"></div>
        <div className="bottomThird"></div>
        <div className='middleThird'></div>
        <DraggableHandle id={1}></DraggableHandle>
    </div>
}

export function DraggableHandle(handleProps){
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: handleProps.id,
      });
      const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;
    return <div className="resizeHandle" ref={setNodeRef} {...listeners} {...attributes}></div>
}