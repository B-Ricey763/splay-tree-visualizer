import { createFileRoute } from "@tanstack/react-router";
import { SplayTreeVisualizer } from "@/components/splay-tree-vis";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div>
			<SplayTreeVisualizer />
		</div>
	);
}
