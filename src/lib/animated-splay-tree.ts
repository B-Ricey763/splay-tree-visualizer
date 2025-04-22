import type { AnimationStep, SplayTreeNode } from "./types";

export class SplayTree {
	root: SplayTreeNode | null = null;

	clone(): SplayTree {
		const newTree = new SplayTree();
		if (this.root) {
			newTree.root = this.cloneNode(this.root);
		}
		return newTree;
	}

	cloneNode(node: SplayTreeNode | null): SplayTreeNode | null {
		if (!node) return null;
		return {
			key: node.key,
			left: this.cloneNode(node.left),
			right: this.cloneNode(node.right),
			// x: node.x,
			// y: node.y,
			// prevX: node.prevX,
			// prevY: node.prevY,
		};
	}

	// Find operation with animation steps
	find(key: number): AnimationStep[] {
		const steps: AnimationStep[] = [];

		if (!this.root) {
			steps.push({
				tree: null,
				cursor: null,
				description: `Tree is empty, cannot find ${key}`,
			});
			return steps;
		}

		steps.push({
			tree: this.cloneNode(this.root),
			description: `Starting search for ${key}`,
			cursor: this.root,
		});

		// Search for the node
		let current = this.root;
		let path: SplayTreeNode[] = [];

		while (current && current.key !== key) {
			path.push(current);
			if (key < current.key) {
				if (!current.left) break;
				current = current.left;
			} else {
				if (!current.right) break;
				current = current.right;
			}

			// Add search step
			steps.push({
				tree: this.cloneNode(this.root),
				description: `Comparing ${key} with ${current.key}`,
				cursor: current,
			});
		}

		// If we found the key or reached a leaf
		if (current) {
			if (current.key === key) {
				steps.push({
					tree: this.cloneNode(this.root),
					description: `Found ${key}, now splaying`,
					cursor: current,
				});

				// Add splay steps
				const splaySteps = this.splay(key);
				steps.push(...splaySteps);

				steps.push({
					tree: this.cloneNode(this.root),
					description: `Completed splaying, ${key} is now at the root`,
					cursor: this.root,
				});
			} else {
				steps.push({
					tree: this.cloneNode(this.root),
					description: `${key} not found in the tree`,
					cursor: null,
				});
			}
		} else {
			steps.push({
				tree: this.cloneNode(this.root),
				description: `${key} not found in the tree`,
				cursor: null,
			});
		}

		return steps;
	}

	// Insert operation with animation steps
	insert(key: number): AnimationStep[] {
		const steps: AnimationStep[] = [];

		if (!this.root) {
			this.root = { key, left: null, right: null };
			steps.push({
				tree: this.cloneNode(this.root),
				description: `Inserted ${key} as the root`,
				cursor: this.root,
			});
			return steps;
		}

		steps.push({
			tree: this.cloneNode(this.root),
			description: `Starting insertion of ${key}`,
			cursor: this.root,
		});

		// First, find where to insert
		let current: SplayTreeNode | null = this.root;
		let parent: SplayTreeNode | null = null;
		let isLeft = false;

		while (current) {
			parent = current;
			if (key < current.key) {
				isLeft = true;
				current = current.left;
			} else if (key > current.key) {
				isLeft = false;
				current = current.right;
			} else {
				// Key already exists
				steps.push({
					tree: this.cloneNode(this.root),
					description: `${key} already exists in the tree`,
					cursor: current,
				});

				// Splay to bring it to the root
				const splaySteps = this.splay(key);
				steps.push(...splaySteps);
				return steps;
			}

			if (current) {
				steps.push({
					tree: this.cloneNode(this.root),
					description: `Moving to ${current.key} while looking for insertion point`,
					cursor: current,
				});
			}
		}

		// Insert the new node
		const newNode: SplayTreeNode = { key, left: null, right: null };
		if (parent) {
			if (isLeft) {
				parent.left = newNode;
			} else {
				parent.right = newNode;
			}

			steps.push({
				tree: this.cloneNode(this.root),
				description: `Inserted ${key} as ${isLeft ? "left" : "right"} child of ${parent.key}`,
				cursor: newNode,
			});
		}

		// Splay the newly inserted node to the root
		const splaySteps = this.splay(key);
		steps.push(...splaySteps);

		steps.push({
			tree: this.cloneNode(this.root),
			description: `Completed insertion, ${key} is now at the root`,
			cursor: newNode,
		});

		return steps;
	}

	// Delete operation with animation steps
	delete(key: number): AnimationStep[] {
		const steps: AnimationStep[] = [];

		if (!this.root) {
			steps.push({
				tree: null,
				description: `Tree is empty, cannot delete ${key}`,
				cursor: null,
			});
			return steps;
		}

		steps.push({
			tree: this.cloneNode(this.root),
			description: `Starting deletion of ${key}`,
			cursor: null,
		});

		// First, find and splay the node to delete
		const splaySteps = this.splay(key);
		steps.push(...splaySteps);

		// If the key doesn't exist after splaying
		if (!this.root || this.root.key !== key) {
			steps.push({
				tree: this.cloneNode(this.root),
				description: `${key} not found, cannot delete`,
				cursor: null,
			});
			return steps;
		}

		// Now the node to delete is at the root
		steps.push({
			tree: this.cloneNode(this.root),
			description: `Found ${key} at the root, preparing to delete`,
			cursor: this.root,
		});

		// Case 1: No left subtree
		if (!this.root.left) {
			this.root = this.root.right;
			steps.push({
				tree: this.cloneNode(this.root),
				description: `Deleted ${key}, right child becomes the new root`,
				cursor: this.root,
			});
		}
		// Case 2: Has left subtree
		else {
			// Find the maximum in the left subtree
			let maxInLeft = this.root.left;
			while (maxInLeft.right) {
				maxInLeft = maxInLeft.right;
			}

			steps.push({
				tree: this.cloneNode(this.root),
				description: `Found maximum in left subtree: ${maxInLeft.key}`,
				cursor: maxInLeft,
			});

			// Splay the maximum to the root of the left subtree
			const tempRoot = this.root;
			this.root = this.root.left;

			const maxSplaySteps = this.splay(maxInLeft.key);
			steps.push(
				...maxSplaySteps.map((step) => ({
					...step,
					description: `Splaying maximum in left subtree: ${step.description}`,
					cursor: this.root,
				})),
			);

			// Now maxInLeft is the root of the left subtree and has no right child
			this.root.right = tempRoot.right;

			steps.push({
				tree: this.cloneNode(this.root),
				description: `Deleted ${key}, the tree is now restructured`,
				cursor: null,
			});
		}

		return steps;
	}

	// Splay operation with animation steps
	splay(key: number): AnimationStep[] {
		// TODO: there is something pretty broken about this function.
		// It returns the new root, so when you are cloning animation steps
		// it doesn't preserve the entire tree structure since it is not really together
		// in the intermediate steps. I'm too lazy to fix, but just fyi.
		const steps: AnimationStep[] = [];

		if (!this.root) {
			return steps;
		}

		// Save the original tree for the first step
		steps.push({
			tree: this.cloneNode(this.root),
			description: `Starting splaying for ${key}`,
			cursor: null,
		});

		// Create a temporary tree for splaying
		let newRoot = this.cloneNode(this.root);

		// Create a dummy tree as a wrapper for the root
		const dummyTree = {
			root: newRoot,
		};

		// Define internal splay function
		const splayNode = (
			tree: { root: SplayTreeNode | null },
			k: number,
		): SplayTreeNode | null => {
			// Base cases
			if (!tree.root) return null;
			if (tree.root.key === k) return tree.root;

			if (k < tree.root.key) {
				// Key is in left subtree
				if (!tree.root.left) return tree.root; // Key not found

				if (k < tree.root.left.key) {
					// Zig-Zig case (left-left)
					if (tree.root.left.left) {
						// First, splay k to be the grandchild's parent
						tree.root.left.left = splayNode({ root: tree.root.left.left }, k);

						// First rotation (grandparent)
						const firstRotation = this.rotateRight(tree.root);
						tree.root = firstRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zig (left-left): First rotation`,
							cursor: firstRotation,
						});

						// Second rotation (parent)
						const secondRotation = this.rotateRight(tree.root);
						tree.root = secondRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zig (left-left): Second rotation`,
							cursor: secondRotation,
						});
					}
				} else if (k > tree.root.left.key) {
					// Zig-Zag case (left-right)
					if (tree.root.left.right) {
						// First, splay k to be the grandchild's parent
						tree.root.left.right = splayNode({ root: tree.root.left.right }, k);

						// First rotation (parent)
						const firstRotation = this.rotateLeft(tree.root.left);
						tree.root.left = firstRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zag (left-right): First rotation`,
							cursor: firstRotation,
						});

						// Second rotation (grandparent)
						const secondRotation = this.rotateRight(tree.root);
						tree.root = secondRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zag (left-right): Second rotation`,
							cursor: secondRotation,
						});
					}
				} else {
					// Zig case (just left child)
					const rotation = this.rotateRight(tree.root);
					tree.root = rotation;

					// Add animation step
					steps.push({
						tree: this.cloneNode(dummyTree.root),
						description: `Zig (left): Single rotation`,
						cursor: rotation,
					});
				}
			} else {
				// k > tree.root.key
				// Key is in right subtree
				if (!tree.root.right) return tree.root; // Key not found

				if (k > tree.root.right.key) {
					// Zig-Zig case (right-right)
					if (tree.root.right.right) {
						// First, splay k to be the grandchild's parent
						tree.root.right.right = splayNode(
							{ root: tree.root.right.right },
							k,
						);

						// First rotation (grandparent)
						const firstRotation = this.rotateLeft(tree.root);
						tree.root = firstRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zig (right-right): First rotation`,
							cursor: firstRotation,
						});

						// Second rotation (parent)
						const secondRotation = this.rotateLeft(tree.root);
						tree.root = secondRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zig (right-right): Second rotation`,
							cursor: secondRotation,
						});
					}
				} else if (k < tree.root.right.key) {
					// Zig-Zag case (right-left)
					if (tree.root.right.left) {
						// First, splay k to be the grandchild's parent
						tree.root.right.left = splayNode({ root: tree.root.right.left }, k);

						// First rotation (parent)
						const firstRotation = this.rotateRight(tree.root.right);
						tree.root.right = firstRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zag (right-left): First rotation`,
							cursor: firstRotation,
						});

						// Second rotation (grandparent)
						const secondRotation = this.rotateLeft(tree.root);
						tree.root = secondRotation;

						// Add animation step
						steps.push({
							tree: this.cloneNode(dummyTree.root),
							description: `Zig-Zag (right-left): Second rotation`,
							cursor: secondRotation,
						});
					}
				} else {
					// Zig case (just right child)
					const rotation = this.rotateLeft(tree.root);
					tree.root = rotation;

					// Add animation step
					steps.push({
						tree: this.cloneNode(dummyTree.root),
						description: `Zig (right): Single rotation`,
						cursor: rotation,
					});
				}
			}

			return tree.root;
		};

		// Perform the splaying
		dummyTree.root = splayNode(dummyTree, key);
		this.root = dummyTree.root;

		// Add the final state
		steps.push({
			tree: this.cloneNode(this.root),
			description: `Completed splaying operation for ${key}`,
			cursor: this.root,
		});

		return steps;
	}

	// Helper method for right rotation
	rotateRight(y: SplayTreeNode): SplayTreeNode {
		if (!y.left) return y;

		const x = y.left;
		y.left = x.right;
		x.right = y;
		return x;
	}

	// Helper method for left rotation
	rotateLeft(x: SplayTreeNode): SplayTreeNode {
		if (!x.right) return x;

		const y = x.right;
		x.right = y.left;
		y.left = x;
		return y;
	}

	// Update operation (find and then update)
	update(oldKey: number, newKey: number): AnimationStep[] {
		const steps: AnimationStep[] = [];

		if (!this.root) {
			steps.push({
				tree: null,
				description: `Tree is empty, cannot update ${oldKey} to ${newKey}`,
				cursor: null,
			});
			return steps;
		}

		// First find and splay the old key
		const findSteps = this.find(oldKey);
		steps.push(...findSteps);

		// If the key wasn't found
		if (!this.root || this.root.key !== oldKey) {
			steps.push({
				tree: this.cloneNode(this.root),
				description: `${oldKey} not found, cannot update to ${newKey}`,
				cursor: this.root,
			});
			return steps;
		}

		// Update the key
		this.root.key = newKey;

		steps.push({
			tree: this.cloneNode(this.root),
			description: `Updated ${oldKey} to ${newKey}`,
			cursor: this.root,
		});

		return steps;
	}

	// Generate random tree
	static random(size: number): SplayTree {
		const tree = new SplayTree();
		const values = new Set<number>();

		// Generate unique random values
		while (values.size < size) {
			values.add(Math.floor(Math.random() * 100) + 1);
		}

		// Insert values
		for (const value of values) {
			tree.insert(value);
		}

		return tree;
	}
}
