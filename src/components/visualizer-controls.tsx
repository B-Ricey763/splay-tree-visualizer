import {
	Pause,
	Play,
	Plus,
	Search,
	Shuffle,
	SkipBack,
	SkipForward,
	Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import type { AnimationStep } from "@/lib/types";

interface VisualizerControlsProps {
	value: string;
	setValue: (v: string) => void;
	handleGenerateRandom: () => void;
	animationSpeed: number;
	setAnimationSpeed: (s: number) => void;
	currentStepIndex: number;
	isPlaying: boolean;
	handleStepForward: () => void;
	handlePlayPause: () => void;
	handleStepBack: () => void;
	handleClear: () => void;
	animationSteps: AnimationStep[];
	handleInsert: () => void;
	handleFind: () => void;
	handleDelete: () => void;
}

export function VisualizerControls(props: VisualizerControlsProps) {
	return (
		<div className="flex flex-col w-full gap-4 mb-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<TreeOperationControls {...props} />
				{/* <UpdateControls /> */}
				<div className="flex flex-col gap-2">
					<TreeGenControls {...props} />
					<AnimationControls {...props} />
				</div>
			</div>
		</div>
	);
}

function TreeOperationControls({
	value,
	setValue,
	handleInsert,
	handleDelete,
	handleFind,
}: VisualizerControlsProps) {
	return (
		<div className="flex gap-2">
			<Input
				type="number"
				placeholder="Enter value"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="w-full"
			/>
			<Button onClick={handleInsert} variant="outline">
				<Plus className="h-4 w-4 mr-2" />
				Insert
			</Button>

			<Button onClick={handleFind} variant="outline">
				<Search className="h-4 w-4 mr-2" />
				Find
			</Button>

			<Button onClick={handleDelete} variant="outline">
				<Trash2 className="h-4 w-4 mr-2" />
				Delete
			</Button>
		</div>
	);
}

function TreeGenControls({
	handleGenerateRandom,
	handleClear,
}: VisualizerControlsProps) {
	return (
		<div className="flex gap-2">
			<Button
				onClick={handleGenerateRandom}
				variant="outline"
				className="w-full"
			>
				<Shuffle className="h-4 w-4 mr-2" />
				Random Tree
			</Button>
			<Button onClick={handleClear} variant="outline" className="w-full">
				<Trash2 className="h-4 w-4 mr-2" />
				Clear Tree
			</Button>
		</div>
	);
}

// function UpdateControls() {
// 	return (
// 		<div className="flex flex-col gap-2">
// 			{/* Update Values */}
// 			<div className="flex gap-2">
// 				<Input
// 					type="number"
// 					placeholder="Old value"
// 					value={updateOldValue}
// 					onChange={(e) => setUpdateOldValue(e.target.value)}
// 					className="w-full"
// 				/>
// 				<Input
// 					type="number"
// 					placeholder="New value"
// 					value={updateNewValue}
// 					onChange={(e) => setUpdateNewValue(e.target.value)}
// 					className="w-full"
// 				/>
// 				<Button onClick={handleUpdate} variant="outline">
// 					<RefreshCw className="h-4 w-4 mr-2" />
// 					Update
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }

function AnimationControls({
	handleStepBack,
	handleStepForward,
	currentStepIndex,
	isPlaying,
	handlePlayPause,
	animationSteps,
	animationSpeed,
	setAnimationSpeed,
}: VisualizerControlsProps) {
	return (
		<>
			<div className="flex gap-2">
				<Button
					onClick={handleStepBack}
					variant="outline"
					disabled={currentStepIndex <= 0}
				>
					<SkipBack className="h-4 w-4" />
				</Button>
				<Button onClick={handlePlayPause} variant="outline" className="w-full">
					{isPlaying ? (
						<Pause className="h-4 w-4 mr-2" />
					) : (
						<Play className="h-4 w-4 mr-2" />
					)}
					{isPlaying ? "Pause" : "Play"}
				</Button>
				<Button
					onClick={handleStepForward}
					variant="outline"
					disabled={currentStepIndex >= animationSteps.length - 1}
				>
					<SkipForward className="h-4 w-4" />
				</Button>
			</div>

			{/* Animation Speed */}
			<div className="flex flex-col gap-1">
				<div className="flex justify-between">
					<span className="text-sm">Animation Speed</span>
					<span className="text-sm">{(animationSpeed / 1000).toFixed(1)}s</span>
				</div>
				<Slider
					value={[animationSpeed]}
					min={100}
					max={2000}
					step={100}
					onValueChange={(value) => setAnimationSpeed(value[0])}
				/>
			</div>
		</>
	);
}
