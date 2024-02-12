import { useEffect, useState, useRef } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import Tree from "react-d3-tree";

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
				new PanelNode("3", "row", [
					new PanelNode("33", "row", []),
					new PanelNode(uuidv4(), "column", []),
				]),
				new PanelNode("4", "row", [
					new PanelNode(uuidv4(), "column", []),
					new PanelNode(uuidv4(), "column", [
						new PanelNode(uuidv4(), "column", []),
						new PanelNode(uuidv4(), "column", []),
					]),
				]),
			]),
			new PanelNode("5", "row", [
				new PanelNode("6", "row", []),
				new PanelNode(uuidv4(), "column", []),
			]),
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
						removeChildFromGraph={removeChildFromGraph}
						color={stringToColour(el.id)}
					></ChildPanel>
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

	function removeChildFromGraph(graph, id) {
		return graph.map((node) => {
			let childIdentified = false;
			node.children.forEach((el) => {
				if (el.id == id) {
					childIdentified = true;

					switch (node.children.indexOf(el)) {
						case 1:
							node = node.children[0];
							break;
						case 0:
							node = node.children[1];
					}
				}
			});
			if (!childIdentified) {
				if (node.children.length === 0) {
					return node;
				} else {
					return {
						...node,
						children: removeChildFromGraph(node.children, id),
					};
				}
			} else {
				return node;
			}
		});
	}

	/**
	 * Method to add a new node to the graph. Splits one child node into a parent node that contains the original child node and a neighbour node.
	 * @param graph
	 * @param id
	 * @param newElement
	 * @param newDir
	 * @returns
	 */
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

	return (
		<div>
			<Holder key={1}>{listOfElements}</Holder>
			{/* <StyledNodesTree graph={graph} key={39} /> */}
		</div>
	);
}

function StyledNodesTree(props) {
	return (
		<div
			id="treeWrapper"
			style={{
				width: "50em",
				height: "20em",
				backgroundColor: "white",
			}}
		>
			<Tree data={props.graph} orientation={"vertical"} />
		</div>
	);
}
function Holder(props) {
	return <div className="holder">{props.children}</div>;
}

function ParentPanel(props) {
	const [dragging, setDragging] = useState(false);
	const [update, setUpdate] = useState(Math.random());
	const [widths, setWidths] = useState(
		Array(props.children.length).fill(1 / props.children.length)
	);
	const selfRef = useRef();

	const handlePointerMove = (event) => {
		if (!dragging) {
			return null;
		}
		if (props.children.length <= 1) {
			return null;
		}

		const rect = selfRef.current.getBoundingClientRect();
		const proportion =
			props.dir == "row"
				? (event.clientX - rect.left) / rect.width
				: (event.clientY - rect.top) / rect.height;
		const spacedWidths = [...widths, 0];
		// Find which border is being grabbed: it can be the left, middle, or right border of a parent div with two children:
		spacedWidths.reduce(
			(accumulator, currentValue, currentIndex, widths) => {
				const diff = Math.abs(accumulator - proportion);
				if (diff <= 0.05) {
					// Pointer is close enough to this border.
					// Set new widths
					if (currentIndex == 1) {
						// If grabbed edge is internal, index will be 1:
						event.stopPropagation();
						setWidths([proportion, 1 - proportion]);
						setUpdate(Math.random()); // Force an update via a random number generator...
					}
					// If grabbed edge is external, index will be 0 or 2:
				} else {
					if (currentIndex >= widths.length) {
						//Grabbed edge is external, need to check now if this borders other borders...
						setUpdate(Math.random()); // Force an update via a random number generator...
						return null;
					}
				}
				return accumulator + currentValue;
			},
			0 // Starting value for the reduce method.
		);
	};

	const handlePointerDown = () => {
		setDragging(true);
		setUpdate(Math.random()); // Force an update via a random number generator...
	};
	const handlePointerUp = () => {
		setDragging(false);
		setUpdate(Math.random()); // Force an update via a random number generator...
	};

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
			{props.children.map((element, index) => {
				return React.cloneElement(element, {
					width: widths[index],
					update: update,
				});
			})}
		</div>
	);
}

function ChildPanel(props) {
	const selfRef = useRef();
	const [image, setImage] = useState("");
	const [dragging, setDragging] = useState(false);
	useEffect(() => {
		setImage(
			`https://picsum.photos/${Math.round(
				parseInt(selfRef.current.getBoundingClientRect().width / 1.2)
			)}/${parseInt(
				selfRef.current.getBoundingClientRect().height / 1.2
			)}`
		);
	}, [props.update]);
	return (
		<div
			className="ChildPanel"
			ref={selfRef}
			id={props.id}
			style={{
				flexGrow: props.width,
				// backgroundColor: props.color,
			}}
			onPointerMove={(event) => {
				if (dragging) {
					event.stopPropagation();
					const rect = selfRef.current.getBoundingClientRect();
					const proportionX =
						(event.clientX - rect.left) / rect.width;
					const proportionY =
						(event.clientY - rect.top) / rect.height;
					console.log("Check");
					if (proportionX <= 0.7) {
						props.setGraph(
							props.addChildToGraph(
								props.graph,
								props.parent.id,
								new PanelNode(uuidv4(), props.parent.dir, []),
								"row"
							)
						);
					}
					if (proportionY <= 0.7) {
						props.setGraph(
							props.addChildToGraph(
								props.graph,
								props.parent.id,
								new PanelNode(uuidv4(), props.parent.dir, []),
								"column"
							)
						);
					}
				}
			}}
			onPointerUp={(event) => {
				setDragging(false);
			}}
			onMouseLeave={(event) => {
				setDragging(false);
			}}
		>
			<div
				className="xButton"
				onPointerDown={(event) => {
					props.setGraph((previous) =>
						props.removeChildFromGraph(props.graph, props.id)
					);
				}}
			>
				X
			</div>
			<div
				className="subdivide"
				onPointerDown={(event) => {
					setDragging(true);
				}}
			></div>
			<img
				className="image"
				src={image}
				style={{ position: "absolute" }}
			/>
			{props.children}
		</div>
	);
}
