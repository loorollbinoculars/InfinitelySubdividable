import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Subdividable } from "./Subdividable";
import { Resizable } from "./Resizable";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

class PanelNode {
	id: string;
	dir: string;
	children: PanelNode[];
	parent: string;

	constructor(id: string, dir: string, children: PanelNode[], parent = "") {
		this.id = id;
		this.dir = dir;
		this.children = children;
		this.parent = parent;
	}
}

export default function App() {
	const startGraph = [
		new PanelNode("1", "row", [
			new PanelNode("2", "column", [
				new PanelNode("3", "row", [new PanelNode("33", "row", [])]),
				new PanelNode("4", "row", []),
			]),
			new PanelNode("5", "column", [new PanelNode("6", "row", [])]),
		]),
	];
	const [graph, setGraph] = useState(startGraph);
	const listOfElements = interpretBinaryGraph(graph);
	console.log(typeof(listOfElements))
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
          id:15;
          dir:row;
          children:[
            {
              id:16;
              dir:row;
              children:[]
          }]
        }
      ];
    }]
    */
	return localGraph.map((el) => {
			if(el.children.length===0){
				return (<ChildPanel key={Math.random()*10} parent={el} id={el.id} graph={graph} setGraph={setGraph} addChildToGraph={addChildToGraph}></ChildPanel>)
			}else{
			return (<ParentPanel key={Math.random()*100} id={el.id} dir={el.dir}>
				{interpretBinaryGraph(el.children)}
				</ParentPanel>)
				
		}})
	}

	function addChildToGraph(
		graph: PanelNode[],
		id: string,
		newElement: PanelNode,
		newDir: string,
		previousElement={}
	) {
		console.log(previousElement)
		const computedGraph = graph.map((element: PanelNode) => {
			if (element.id == id) {
				previousElement.children.push(new PanelNode("Constructed", element.dir, [element, newElement]))
				const idx = previousElement.children.indexOf(element)
				previousElement.children.splice(idx, idx+1)
			} else {
				element.children = addChildToGraph(
					element.children,
					id,
					newElement,
					newDir,
					element
				);
			}
			return element;
		});
		return computedGraph;
	}

	return (
		<Holder key={1}>{listOfElements}
		</Holder>
	);
}

function Holder(props){
  return <div className="holder">{props.children}</div>
}

function DiegoResizable(props) {
	const [dragging, setDragging] = useState(false);
	const [handleBeingDragged, setHandleBeingDragged] = useState(null);
	const [dim, setDim] = useState(80);
	function clickOnHandle(event, handletype) {
		setDragging(true);
		setHandleBeingDragged(handletype);
	}

	const emptyImg = new Image();
	return (
		<div
			className="testResizable"
			style={{
				flexBasis: dim + "%",
			}}
		>
			<div
				className="rightHandle"
				onPointerDown={(e) => {
					clickOnHandle(e, "right");
				}}
				onPointerMove={(event) => {
					if (dragging) {
						// console.log(event.clientX + "  " + event.clientY);
						// console.log(event.target.getBoundingClientRect());
					}
					// setDim((previous) => previous - 1);
				}}
				onPointerUp={() => setDragging(false)}
				onDragEnd={() => console.log("ENDED")}
				draggable={true}
			></div>
			<div
				className="bottomHandle"
				onMouseDown={(e) => {
					clickOnHandle(e, "bottom");
				}}
			></div>
			<div
				className="leftHandle"
				onMouseDown={(e) => {
					clickOnHandle(e, "left");
				}}
			></div>
			<div
				className="topHandle"
				onMouseDown={(e) => {
					clickOnHandle(e, "top");
				}}
			></div>
		</div>
	);
}

function interpretGraph(graph, c) {
	const colors = [
		"green",
		"red",
		"blue",
		"gray",
		"white",
		"yellow",
		"brown",
		"aliceblue",
		"darkgreen",
	];
	if (graph.length == 1) {
		return (
			<div
				className="subdividableElement"
				style={{
					display: "flex",
					flexBasis: 50 + "%",
					backgroundColor: colors[c],
				}}
			></div>
		);
	} else {
		return (
			<div
				className="subdividableElement"
				style={{
					display: "flex",
					flexBasis: 50 + "%",
					backgroundColor: colors[c],
					flexDirection: graph[0].dir,
				}}
			>
				{interpretGraph(graph.slice(1), c + 1)}
			</div>
		);
	}
}

function ParentPanel(props){
  return <div className="ParentPanel" id = {props.id} style={{flexDirection: props.dir}}>{props.children}</div>
}

function ChildPanel(props){
  return <div
    className="subdividableWrapper"
	id={props.id}
    style={{
      display: "flex",
      flexBasis: 100 + "%",
      border: "1px red solid"
    }}
    onClick={(event) => {
      event.stopPropagation();
      // console.log(event.target.id);
      const rect = event.target.getBoundingClientRect();
      const xProportion =
        (event.clientX - rect.left) / rect.width;
      const yProportion =
        (event.clientY - rect.top) / rect.height;
      let dir = "row";
      if (xProportion >= 0.8 || xProportion <= 0.2) {
        dir = "row";
      }
      if (yProportion >= 0.8 || yProportion <= 0.2) {
        dir = "column";
      }
      props.setGraph(() =>
        props.addChildToGraph(
          props.graph,
          props.parent.id,
          new PanelNode(
            props.parent.id + String(Math.random() * 100),
            dir,
            []
          ),
          dir
        )
      );
    }}
    >{props.children ? props.children : null}
  </div>
}