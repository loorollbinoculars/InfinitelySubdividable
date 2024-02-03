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

	constructor(id: string, dir: string, children: PanelNode[]) {
		this.id = id;
		this.dir = dir;
		this.children = children;
	}
}

export default function App() {
	const startGraph = [
		new PanelNode("1", "row", [
			// new PanelNode("2", "column", [
			// 	new PanelNode("3", "row", [new PanelNode("33", "row", [])]),
			// 	new PanelNode("4", "row", []),
			// ]),
			// new PanelNode("5", "column", [new PanelNode("6", "row", [])]),
		]),
	];
	const [graph, setGraph] = useState(startGraph);
	let listOfElements = interpretBinaryGraph(graph);

	// useEffect(() => {
	// 	listOfElements = interpretBinaryGraph(graph);
	// }, [graph]);
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
				className="subdividableElement"
				key={el.id}
				id={el.id}
				style={{
					display: "flex",
					flexBasis: 50 + "%",
					border: "1px red solid",
					padding: "2px",
					// backgroundColor:
					// 	"#" +
					// 	(((1 << 24) * Math.random()) | 0)
					// 		.toString(16)
					// 		.padStart(6, "0"),
					flexDirection: el.dir,
				}}
				onClick={(event) => {
					event.stopPropagation();
					console.log(event.target.id);
					let rect = event.target.getBoundingClientRect();
					let xProportion = (event.clientX - rect.left) / rect.width;
					let yProportion = (event.clientY - rect.top) / rect.height;
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

	return (
		<div className="holder" style={{ resize: "both", overflow: "hidden" }}>
			{listOfElements}
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
