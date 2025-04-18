import { layoutSplayTree, type PositionedNode } from "@/lib/binary-tree-layout";
import type { SplayTreeNode } from "@/lib/types";
import { motion } from "framer-motion";

interface SvgNodeProps {
	node: PositionedNode;
	isCursor: boolean;
}

const LINE_COLOR = "#696969";
const CIRCLE_WIDTH = 10;
export const SvgNode = ({ node }: SvgNodeProps) => (
	<g>
		{node.left && (
			<line
				x1={node.x}
				y1={node.y}
				x2={node.left.x}
				y2={node.left.y}
				stroke={LINE_COLOR}
				strokeWidth="1"
			/>
		)}
		{node.right && (
			<line
				x1={node.x}
				y1={node.y}
				x2={node.right.x}
				y2={node.right.y}
				stroke={LINE_COLOR}
				strokeWidth="1"
			/>
		)}
		<motion.circle
			r={CIRCLE_WIDTH}
			fill="#3b82f6"
			animate={{ cx: node.x, cy: node.y }}
		></motion.circle>
		<motion.text
			dy=".33em"
			fontSize={6}
			fontFamily="Arial"
			textAnchor="middle"
			fill="white"
			style={{ pointerEvents: "none" }}
			animate={{
				x: node.x,
				y: node.y,
			}}
		>
			{node.treeNode.key}
		</motion.text>
	</g>
);

interface SvgTreeProps {
	tree: SplayTreeNode;
	cursor: number;
}

export function SvgTree({ tree, cursor }: SvgTreeProps) {
	const positionedNodes = layoutSplayTree(tree);
	const cursorNode = positionedNodes.find((node) => node.value === cursor);
	return (
		<svg
			className="w-full h-auto"
			viewBox="0 0 300 200"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="300" height="200" fill="#F7EDFD" rx="5" ry="5" />
			{positionedNodes.map((node) => (
				<SvgNode
					key={node.value}
					node={node}
					isCursor={node.treeNode.key === cursor}
				/>
			))}
			{cursorNode && (
				<motion.circle
					animate={{
						cx: cursorNode.x,
						cy: cursorNode.y,
					}}
					r={CIRCLE_WIDTH}
					fill="none"
					stroke="#4CAF50"
					stroke-width="2"
				/>
			)}
		</svg>
	);
}
