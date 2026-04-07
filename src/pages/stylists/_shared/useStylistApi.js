import { useEffect, useState, useCallback } from "react";

export function useStylistApi(fn, deps = [], { auto = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(auto);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setData(res?.data ?? res);
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (auto) run().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, run, setData };
}
