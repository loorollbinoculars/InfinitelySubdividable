import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Resizable} from "./Resizable"
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

export default function App() {
  const [parent, setParent] = useState(null);
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;



  return (
    <div className="holder">
      {/* <DndContext  onDragOver={handleDragOver} >
        {parent === null ? draggableMarkup : null}
        <Droppable key={0} id={0}>{parent === 0 ? draggableMarkup : "Drop here 0"}</Droppable>
        <div style={{width:"300px", height:"300px"}}><Droppable key={1} id={1}>{parent === 1 ? draggableMarkup : "Drop here 1"}</Droppable><Droppable key={2} id={2}>{parent === 2 ? draggableMarkup : "Drop here 2"}</Droppable></div>
      </DndContext> */}
      <DndContext onDragOver={handleDragOver}>
        <Resizable id={1}></Resizable>
        <Resizable id={2}></Resizable>
      </DndContext>
    </div>
  );

  function handleDragOver(event){
    const { over } = event;
    console.log(event)
    setParent(over ? over.id : null);
  }
}
