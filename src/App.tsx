import { useEffect, useState, useRef } from "react";
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
			id:16;
			dir:row;
			children:[]
		}]
      ];
    }]
    */
		return localGraph.map((el) => {
			if (el.children.length === 0) {
				return (
					<ChildPanel
						key={Math.random() * 10}
						parent={el}
						id={el.id}
						graph={graph}
						setGraph={setGraph}
						addChildToGraph={addChildToGraph}
					></ChildPanel>
				);
			} else {
				return (
					<ParentPanel
						key={Math.random() * 100}
						id={el.id}
						dir={el.dir}
					>
						{interpretBinaryGraph(el.children)}
					</ParentPanel>
				);
			}
		});
	}
	function splitChildNode(node, newElement, newDir) {
		return new PanelNode(
			node.id + "parent",
			newDir,
			[node, newElement],
			""
		);
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
				children: addChildToGraph(
					node.children,
					id,
					newElement,
					newDir
				),
			};
		});
	}
	return <Holder key={1}>{listOfElements}</Holder>;
}

function Holder(props) {
	return <div className="holder">{props.children}</div>;
}

function ParentPanel(props) {
	return (
		<div
			className="ParentPanel"
			id={props.id}
			style={{ flexDirection: props.dir }}
			onPointerDown={(event)=>{
				event.stopPropagation();
				const rect = event.target.getBoundingClientRect();
				const xProportion = (event.clientX - rect.left) / rect.width;
				console.log(props.children)
			}}
		>
			{props.children}
		</div>
	);
}

function ChildPanel(props) {
	const [basis, setBasis] = useState(100);
	const [screenXOriginal, setScreenXOriginal] = useState(0);
	const [screenYOriginal, setScreenYOriginal] = useState(0);
	const [dragging, setDragging] = useState(false);
	return (
		<div
			className="subdividableWrapper"
			id={props.id}
			style={{
				display: "flex",
				flexBasis: basis + "%",
				border: "1px red solid",
				alignItems: "center",
				justifyContent: "center",
			}}
			onPointerDown={(event) => {
				setScreenXOriginal(event.screenX);
				setScreenYOriginal(event.screenY);
				setDragging(() => true);
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
				props.setGraph((previous) =>
					props.addChildToGraph(
						props.graph,
						props.parent.id,
						new PanelNode(
							props.parent.id +
								String(Math.random() * 100) +
								"child",
							dir,
							[]
						),
						dir
					)
				);
			}}
			onPointerMove={(event) => {
				if (dragging) {
					setBasis((previous) => previous - 1);
				}
			}}
			// onMouseLeave={(event) => {
			// 	setDragging(false);
			// }}
		>
			{props.children}
		</div>
	);
}
