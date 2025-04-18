import { useState, useEffect, useRef } from "react";
import { SplayTree } from "@/lib/animated-splay-tree";
import type { AnimationStep } from "@/lib/types";
import { VisualizerControls } from "./visualizer-controls";
import { SvgTree } from "./animated-binary-tree";

export const SplayTreeVisualizer = () => {
	const [tree, setTree] = useState<SplayTree>(new SplayTree());
	const [value, setValue] = useState<string>("");
	// const [updateOldValue, setUpdateOldValue] = useState<string>("");
	// const [updateNewValue, setUpdateNewValue] = useState<string>("");
	const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
	const timeoutRef = useRef<any | null>(null);

	// Dimensions
	// const width = 800;
	// const height = 500;
	// const margin = { top: 30, left: 40, right: 40, bottom: 70 };
	// const innerWidth = width - margin.left - margin.right;
	// const innerHeight = height - margin.top - margin.bottom;

	// Animation control functions
	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleStepBack = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1);
		}
	};

	const handleStepForward = () => {
		if (currentStepIndex < animationSteps.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1);
		} else {
			setIsPlaying(false);
		}
	};

	// Operation handlers
	const handleInsert = () => {
		const key = parseInt(value);
		if (isNaN(key) || key <= 0) {
			alert("Please enter a positive integer");
			return;
		}

		const clonedTree = tree.clone();
		const steps = clonedTree.insert(key);
		setTree(clonedTree);
		setAnimationSteps(steps);
		setCurrentStepIndex(0);
		setIsPlaying(true);
		setValue("");
	};

	const handleFind = () => {
		const key = parseInt(value);
		if (isNaN(key) || key <= 0) {
			alert("Please enter a positive integer");
			return;
		}

		const clonedTree = tree.clone();
		const steps = clonedTree.find(key);
		setTree(clonedTree);
		setAnimationSteps(steps);
		setCurrentStepIndex(0);
		setIsPlaying(true);
		setValue("");
	};

	const handleDelete = () => {
		const key = parseInt(value);
		if (isNaN(key) || key <= 0) {
			alert("Please enter a positive integer");
			return;
		}

		const clonedTree = tree.clone();
		const steps = clonedTree.delete(key);
		setTree(clonedTree);
		setAnimationSteps(steps);
		setCurrentStepIndex(0);
		setIsPlaying(true);
		setValue("");
	};

	// const handleUpdate = () => {
	// 	const oldKey = parseInt(updateOldValue);
	// 	const newKey = parseInt(updateNewValue);
	//
	// 	if (isNaN(oldKey) || oldKey <= 0 || isNaN(newKey) || newKey <= 0) {
	// 		alert("Please enter positive integers for both values");
	// 		return;
	// 	}
	//
	// 	const clonedTree = tree.clone();
	// 	const steps = clonedTree.update(oldKey, newKey);
	// 	setTree(clonedTree);
	// 	setAnimationSteps(steps);
	// 	setCurrentStepIndex(0);
	// 	setIsPlaying(true);
	// 	setUpdateOldValue("");
	// 	setUpdateNewValue("");
	// };

	const handleGenerateRandom = () => {
		const size = Math.floor(Math.random() * 7) + 3; // Between 3 and 10 nodes
		const randomTree = SplayTree.random(size);
		setTree(randomTree);
		setAnimationSteps([
			{
				tree: randomTree.cloneNode(randomTree.root),
				description: `Generated random tree with ${size} nodes`,
				cursor: null,
			},
		]);
		setCurrentStepIndex(0);
	};

	const handleClear = () => {
		setTree(new SplayTree());
		setAnimationSteps([
			{
				tree: null,
				cursor: null,
				description: "Tree cleared",
			},
		]);
		setCurrentStepIndex(0);
	};

	// Animation timer effect
	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		if (isPlaying && currentStepIndex < animationSteps.length - 1) {
			timeoutRef.current = setTimeout(() => {
				setCurrentStepIndex(currentStepIndex + 1);
			}, animationSpeed);
		} else if (currentStepIndex >= animationSteps.length - 1) {
			setIsPlaying(false);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isPlaying, currentStepIndex, animationSteps, animationSpeed]);

	// Current tree data based on animation step
	const currentTreeData =
		animationSteps.length > 0
			? animationSteps[currentStepIndex].tree
			: tree.root;

	const currentCursor =
		animationSteps.length > 0
			? (animationSteps[currentStepIndex].cursor?.key ?? 0)
			: 0;

	const currentDescription =
		animationSteps.length > 0
			? animationSteps[currentStepIndex].description
			: "No operations performed yet";

	return (
		<div className="flex flex-col items-center p-6 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Splay Tree Visualizer</h1>

			{/* Controls Section */}
			<VisualizerControls
				value={value}
				setValue={setValue}
				handleGenerateRandom={handleGenerateRandom}
				animationSpeed={animationSpeed}
				setAnimationSpeed={setAnimationSpeed}
				currentStepIndex={currentStepIndex}
				isPlaying={isPlaying}
				handleStepForward={handleStepForward}
				handlePlayPause={handlePlayPause}
				handleStepBack={handleStepBack}
				handleClear={handleClear}
				animationSteps={animationSteps}
				handleInsert={handleInsert}
				handleFind={handleFind}
				handleDelete={handleDelete}
			/>

			{/* Tree Visualization */}
			<div className="border rounded-lg p-4 w-full bg-white">
				<div className="mb-2 h-16 overflow-auto p-2 border rounded bg-slate-50">
					<p className="text-sm">{currentDescription}</p>
				</div>
			</div>

			{currentTreeData && (
				<SvgTree tree={currentTreeData} cursor={currentCursor} />
			)}

			{/* Animation Progress */}
			<div className="w-full mt-4">
				<div className="flex justify-between mb-1">
					<span className="text-sm">Animation Progress</span>
					<span className="text-sm">
						{currentStepIndex + 1} of {animationSteps.length}
					</span>
				</div>
				<div className="w-full bg-slate-200 rounded-full h-2">
					<div
						className="bg-blue-500 h-2 rounded-full transition-all duration-300"
						style={{
							width: `${animationSteps.length ? ((currentStepIndex + 1) / animationSteps.length) * 100 : 0}%`,
						}}
					></div>
				</div>
			</div>
		</div>
	);
};
