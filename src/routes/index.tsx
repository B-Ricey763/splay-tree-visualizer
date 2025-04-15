import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import NetworkShowcase from "@/components/visx-network-showcase";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="text-center">
			<NetworkShowcase width={1000} height={1000} />
		</div>
	);
}
