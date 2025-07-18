import { useEffect, useState } from 'react';
import { ZapperAPI, analyzeReservePortfolio } from '../services/zapper';

interface UseMentoReserveResult {
  data: any;
  loading: boolean;
  error: string | null;
}

export function useMentoReserve(): UseMentoReserveResult {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    analyzeReservePortfolio()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch reserve data');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
} 