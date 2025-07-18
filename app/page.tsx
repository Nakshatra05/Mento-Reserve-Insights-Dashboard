'use client';

import { useState, useEffect } from 'react';
import { ReserveData, Chain } from '../types';
import OverviewCards from '../components/OverviewCards';
import AssetBreakdown from '../components/AssetBreakdown';
import ChainComparison from '../components/ChainComparison';
import ProtocolBreakdown from '../components/ProtocolBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/mentoReserve')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch reserve data');
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch reserve data');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="frosted-glass rounded-3xl p-12 shadow-2xl text-center max-w-2xl mx-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-slate-800">System Error</h2>
          <p className="text-xl text-slate-600 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );

  // Prepare data for components
  const summary = data?.summary || {};
  const tokens = (data?.tokens || []).map((t: any) => ({ symbol: t.symbol, balanceUSD: t.balanceUSD }));
  const assetCount = tokens.length;
  // Chain breakdown: sum by network name
  const chainMap: Record<string, number> = {};
  (data?.tokens || []).forEach((t: any) => {
    if (!chainMap[t.network]) chainMap[t.network] = 0;
    chainMap[t.network] += t.balanceUSD;
  });
  (data?.protocols || []).forEach((p: any) => {
    if (!chainMap[p.network]) chainMap[p.network] = 0;
    chainMap[p.network] += p.totalValue;
  });
  const chainBreakdown = Object.entries(chainMap).map(([chain, value]) => ({ chain, value }));
  const protocols = data?.protocols || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="animate-float">
            <h1 className="text-7xl md:text-8xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent leading-tight">
              Mento Reserve Insights Dashboard
            </h1>
            <p className="text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Visualizing the composition and distribution of Mento's on-chain reserve assets across Celo and Ethereum, including asset, chain, and protocol-level breakdowns.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <OverviewCards summary={summary} chainBreakdown={chainBreakdown} assetCount={assetCount} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
          <AssetBreakdown tokens={tokens} />
          <ChainComparison chainBreakdown={chainBreakdown} />
        </div>
        
        <ProtocolBreakdown protocols={protocols} />
      </main>
    </div>
  );
}