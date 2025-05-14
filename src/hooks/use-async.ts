
import { useState, useEffect } from "react";

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  initialData: T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    asyncFunction()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}
