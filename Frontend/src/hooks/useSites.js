import { useEffect, useState } from "react";
import { getSites } from "../api/sites.api";

export default function useSites() {
	const [sites, setSites] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("useSites: Fetching sites...");
		getSites()
			.then((data) => {
				console.log("useSites: Sites fetched:", data);
				setSites(data || []);
			})
			.catch((error) => {
				console.error("useSites: Error fetching sites:", error);
				setSites([]);
			})
			.finally(() => setLoading(false));
	}, []);

	return { sites, loading };
}
