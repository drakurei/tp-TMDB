import { useEffect, useState } from "react";

// Runs a TMDB service function when `deps` change and exposes
// { data, loading, error }. The previous request is aborted.
export function useTmdb(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    // Keep the previous data while loading, so the grid does not flash empty
    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetcher(controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
  }, deps);

  return state;
}
