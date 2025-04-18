import type { SplayTreeNode } from "./types";

export interface PositionedNode {
	treeNode: SplayTreeNode;
	value: number;
	x: number;
	y: number;
	left: PositionedNode | null;
	right: PositionedNode | null;
}

/**
 * Calculates the layout for a splay tree, positioning nodes for visualization
 * @param root The root node of the splay tree
 * @returns An array of positioned nodes with their coordinates and references
 */
export function layoutSplayTree(root: SplayTreeNode | null): PositionedNode[] {
	if (!root) return [];

	const nodeMap = new Map<SplayTreeNode, PositionedNode>();
	const positionedNodes: PositionedNode[] = [];
	const WIDTH_DELTA = 30;
	const HEIGHT_DELTA = 20;
	const STARTING_Y = 50;

	// Calculate the width requirements for each subtree
	function calculateWidths(node: SplayTreeNode | null): {
		leftWidth: number;
		rightWidth: number;
	} {
		if (!node) return { leftWidth: 0, rightWidth: 0 };

		const left = calculateWidths(node.left);
		const right = calculateWidths(node.right);

		// Store width info on the node for later use
		const nodeWithWidths = node as SplayTreeNode & {
			leftWidth: number;
			rightWidth: number;
		};

		nodeWithWidths.leftWidth = Math.max(
			left.leftWidth + left.rightWidth,
			WIDTH_DELTA / 2,
		);
		nodeWithWidths.rightWidth = Math.max(
			right.leftWidth + right.rightWidth,
			WIDTH_DELTA / 2,
		);

		return {
			leftWidth: nodeWithWidths.leftWidth,
			rightWidth: nodeWithWidths.rightWidth,
		};
	}

	// First pass: create positioned nodes without connections
	function createPositionedNodes(
		node: SplayTreeNode | null,
		xPosition: number,
		yPosition: number,
		side: number,
	): PositionedNode | null {
		if (!node) return null;

		const nodeWithWidths = node as SplayTreeNode & {
			leftWidth: number;
			rightWidth: number;
		};

		// Adjust x position based on which side we're on
		if (side === -1) {
			xPosition = xPosition - nodeWithWidths.rightWidth;
		} else if (side === 1) {
			xPosition = xPosition + nodeWithWidths.leftWidth;
		}

		// Create positioned node
		const positionedNode: PositionedNode = {
			treeNode: node,
			value: node.key,
			x: xPosition,
			y: yPosition,
			left: null,
			right: null,
		};

		// Store in map and results array
		nodeMap.set(node, positionedNode);
		positionedNodes.push(positionedNode);

		// Recursively position children
		const leftPositioned = createPositionedNodes(
			node.left,
			xPosition,
			yPosition + HEIGHT_DELTA,
			-1,
		);
		const rightPositioned = createPositionedNodes(
			node.right,
			xPosition,
			yPosition + HEIGHT_DELTA,
			1,
		);

		// Connect children
		positionedNode.left = leftPositioned;
		positionedNode.right = rightPositioned;

		return positionedNode;
	}

	// Calculate the width requirements
	const { leftWidth, rightWidth } = calculateWidths(root);

	// Determine the starting x position
	let startingX = 150; // Default center point

	if (leftWidth > startingX) {
		startingX = leftWidth;
	} else if (rightWidth > startingX) {
		startingX = Math.max(leftWidth, 2 * startingX - rightWidth);
	}

	// Create and connect all nodes
	createPositionedNodes(root, startingX, STARTING_Y, 0);

	return positionedNodes;
}
