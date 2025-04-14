import { useEffect, useRef } from "react";

const useDebounce = (callback, delay = 300) => {
	const timeoutRef = useRef(null);

	const debouncedFunction = (...args) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => clearTimeout(timeoutRef.current);
	}, []);

	return debouncedFunction;
};

export default useDebounce;
