export type NodeData = {
	key: number;
	children?: NodeData[];
};

export type SplayTreeNode = {
	key: number;
	left: SplayTreeNode | null;
	right: SplayTreeNode | null;
};

export type AnimationStep = {
	tree: SplayTreeNode | null;
	cursor: SplayTreeNode | null;
	description: string;
};
