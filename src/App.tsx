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
		const computedReturn = localGraph.map((el: PanelNode) => (
			<div
				className="subdividableWrapper"
				key={el.id}
				id={el.id}
				style={{
					display: "flex",
					flexBasis: 100 + "%",
					border: "1px red solid",
					flexDirection: el.dir,
					resize: "both",
					overflow: "auto",
				}}
				onClick={(event) => {
					event.stopPropagation();
					console.log(event.target.id);
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
					setGraph(() =>
						addChildToGraph(
							graph,
							el.id,
							new PanelNode(
								el.id + String(Math.random() * 100),
								dir,
								[]
							),
							dir
						)
					);
				}}
			>
				{interpretBinaryGraph(el.children)}
			</div>
		));
		return computedReturn;
	}

	function addChildToGraph(
		graph: PanelNode[],
		id: string,
		newElement: PanelNode,
		newDir: string
	) {
		const computedGraph = graph.map((element: PanelNode) => {
			if (element.id == id) {
				newElement.parent = element.parent;
				element.children.push(newElement);
				element.dir = newDir;
			} else {
				element.children = addChildToGraph(
					element.children,
					id,
					newElement,
					newDir
				);
			}
			return element;
		});
		return computedGraph;
	}

	function getBorders(graph: PanelNode[], elementId: string, side: string) {
		return null;
	}

	return (
		<div className="holder" style={{ resize: "both", overflow: "hidden" }}>
			{/* {listOfElements} */}
			<DiegoResizable />
		</div>
	);
}

function DiegoResizable(props) {
	const [dragging, setDragging] = useState(false);
	const [handleBeingDragged, setHandleBeingDragged] = useState(null);
	const [dims, setDims] = useState([null, null]);

	function clickOnHandle(event, handletype) {
		setDragging(true);
		setHandleBeingDragged(handletype);
	}
	const emptyImg = new Image();
	return (
		<div
			className="testResizable"
			style={{
				width: dims[0] == null ? "100%" : dims[0],
				height: dims[1] == null ? "100%" : dims[1],
			}}
		>
			<div
				className="rightHandle"
				onMouseDown={(e) => {
					clickOnHandle(e, "right");
				}}
				onDragStart={(e) => {
					e.dataTransfer.setDragImage(emptyImg, 0, 0);
				}}
				onDrag={(e) => {
					console.log(e);
				}}
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
