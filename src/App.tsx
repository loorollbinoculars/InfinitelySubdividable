import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Subdividable } from "./Subdividable";
import { Resizable } from "./Resizable";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

export default function App() {
  // const [parent, setParent] = useState(null);
  // const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  // const [isOver, setIsOver] = useState(1);
  const [graph, setGraph] = useState([new PanelNode("rf", "row", [], [], [], [])]);
  const listOfElements = interpretGraph(graph, 0)

  return (
    <div className="holder">
      <DndContext>{listOfElements}</DndContext>
      <button
        onClick={() => {
          const i = graph;
          i[i.length-1].dir="row";
          setGraph([...i, new PanelNode("mf", "row", ["rf"], [], [], [])]);
        }}
      >Left</button>
      <button onClick={()=>{
          const i = graph;
          i[i.length-1].dir = "column"
          setGraph([...i, new PanelNode("mf", "column", ["rf"], [], [], [])]);
        }}>Down</button>
      <input type="text"></input>
    </div>
  );

  // function handleDragOver(event){
  //   const { over } = event;
  //   setIsOver(over ? over.id : null)
  // setParent(over ? over.id : null);
  // }

  // function handleDragEnd(event){
  //   const {over} = event;

  // }

  // function handleDragStart(event){

  // }
}

function interpretGraph(graph, c) {
  const colors = ['green', 'red', 'blue', 'gray', 'white', 'yellow', 'brown', 'aliceblue', 'darkgreen']
  console.log(colors[c])
  if (graph.length == 1) {
    return <div className="subdividableElement" style={{display: "flex", flexBasis:50 + "%", backgroundColor:colors[c]}}></div>;
  } else {
    return <div className="subdividableElement" style={{display: "flex", flexBasis:50 + "%", backgroundColor:colors[c], flexDirection: graph[0].dir}}>{interpretGraph(graph.slice(1), c+1)}</div>;
  }
}

class PanelNode {
  id: string;
  dir:string;
  left: string[];
  right: string[];
  up: string[];
  down: string[];

  constructor(id, dir, left, right, up, down) {
    this.id = id;
    this.dir=dir,
    this.left = left;
    this.right = right;
    this.up = up;
    this.down = down;
  }
}
