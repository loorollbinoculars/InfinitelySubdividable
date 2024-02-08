import { useEffect, useState, useRef } from "react";
import React from 'react'
import { v4 as uuidv4 } from "uuid";

class PanelNode {
  id: string;
  dir: string;
  children: PanelNode[];
  parent: string;

  constructor(id: string, dir: string, children: PanelNode[], parent = "") {
    this.id = id || uuidv4();
    this.dir = dir;
    this.children = children;
    this.parent = parent;
  }
}

export default function App() {
  const startGraph = [
    new PanelNode("1", "row", [
      new PanelNode(uuidv4(), "column", [
        new PanelNode("3", "row", [new PanelNode("33", "row", [])]),
        new PanelNode("4", "row", [
          new PanelNode(uuidv4(), "column", []), 
          new PanelNode(uuidv4(), "column", [])]),
      ]),
      new PanelNode("5", "row", [new PanelNode("6", "row", [])]),
    ]),
  ];
  const [graph, setGraph] = useState(startGraph);
  const listOfElements = interpretBinaryGraph(graph);


  function interpretBinaryGraph(localGraph) {
    /*Graph is a binary tree that can look like:
              o   o
            /    /
    o--o--o-----o
            \
             o
  
    Syntax:
    [{
      id: 13;
      dir: row;
      children:[
        {
			id:14;
			dir:column;
			children:[];  
        },
		{
			id:16;
			dir:row;
			children:[]
		}]
      ];
    }]
    */
    const stringToColour = (str: string) => {
      let hash = 0;
      str.split("").forEach((char) => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
      });
      let colour = "#";
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, "0");
      }
      return colour;
    };

    return localGraph.map((el) => {
      if (el.children.length === 0) {
        return (
          <ChildPanel
            key={el.id} 
            parent={el}
            id={el.id}
            graph={graph}
            setGraph={setGraph}
            addChildToGraph={addChildToGraph}
            color={stringToColour(el.id)}></ChildPanel>
        );
      } else {
        return (
          <ParentPanel key={el.id} id={el.id} dir={el.dir}>
            {interpretBinaryGraph(el.children)}
          </ParentPanel>
        );
      }
    });
  }
  function splitChildNode(node, newElement, newDir) {
    return new PanelNode(uuidv4(), newDir, [node, newElement], "");
  }

  function addChildToGraph(
    graph: PanelNode[],
    id: string,
    newElement: PanelNode,
    newDir: string
  ): PanelNode[] {
    return graph.map((node) => {
      if (node.id === id) {
        return splitChildNode(node, newElement, newDir);
      }

      if (node.children.length === 0) {
        return node;
      }

      // Recursively search for the node in the children
      return {
        ...node,
        children: addChildToGraph(node.children, id, newElement, newDir),
      };
    });
  }
  return <Holder key={1}>{listOfElements}</Holder>;
}

function Holder(props) {
  return <div className="holder">{props.children}</div>;
}

function ParentPanel(props) {
  const [dragging, setDragging] = useState(false);
  const [widths, setWidths] = useState(Array(props.children.length).fill(1/props.children.length))
  const selfRef = useRef()

  useEffect(()=>{console.log("re-rendering")},[widths])
  const handlePointerMove = (event) => {
    if(props.children.length<=1){
      return null
    }
    if(!dragging){
      return null
    }
    const rect = selfRef.current.getBoundingClientRect();
    const proportion = props.dir=="row" ? (event.clientX - rect.left) / rect.width : (event.clientY - rect.top) / rect.height 
    const spacedWidths = [...widths, 0]
    spacedWidths.reduce((accumulator, currentValue, currentIndex, widths)=>{
      const diff = Math.abs(accumulator - proportion)
      if(diff<=0.15){
        //Set new widths
        if(currentIndex==1){
          // If grabbed edge is internal, index will be 1:
          
    event.stopPropagation();
          setWidths(
            [proportion, 1-proportion]
          )
        }
        // If grabbed edge is external, index will be 0 or 2:
        
      }else{
          if(currentIndex>=widths.length){
              return null
          } }
          return accumulator + currentValue
     
  }, 0)
  }

  const handlePointerDown = ()=>{
    setDragging(true)
  }
  const handlePointerUp = ()=>{
    setDragging(false)
  }
  
  return (
    <div
      className="ParentPanel"
      ref={selfRef}
      id={props.id}
      style={{ flexDirection: props.dir, flexGrow: props.width }}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onMouseLeave={handlePointerUp}
    >
      {props.children.map((element, index)=>{
        return React.cloneElement(element, {width:widths[index]})})}
    </div>
  );
}

function ChildPanel(props) {
   
  return (
    <div
      className="subdividableWrapper"
      id={props.id}
      style={{
        display: "flex",
        flexGrow: props.width,
        border: "1px red solid",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: props.color,
      }}
      onPointerDown={(event) => {
        const rect = event.target.getBoundingClientRect();
        const xProportion = (event.clientX - rect.left) / rect.width;
        const yProportion = (event.clientY - rect.top) / rect.height;
        let dir = "row";
        if (xProportion >= 0.8 || xProportion <= 0.2) {
          dir = "row";
        }
        if (yProportion >= 0.8 || yProportion <= 0.2) {
          dir = "column";
        }
        // props.setGraph((previous) =>
        //   props.addChildToGraph(
        //     props.graph,
        //     props.parent.id,
        //     new PanelNode(uuidv4(), dir, []),
        //     dir
        //   )
        // );
      }}
    >
      {props.children}
    </div>
  );
}
