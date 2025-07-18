import React from 'react';
import { TrendingUp, Layers, Network, PieChart } from 'lucide-react';

interface OverviewCardsProps {
  summary: {
    totalTokens: number;
    totalApps: number;
    totalNFTs: number;
    grandTotal: number;
    assetsList: string[];
  };
  chainBreakdown: Array<{ chain: string; value: number }>;
  assetCount: number;
}

export default function OverviewCards({ summary, chainBreakdown, assetCount }: OverviewCardsProps) {
  const totalValue = summary.grandTotal || 0;
  const assetsList = summary.assetsList || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
      {/* Total Value Card */}
      <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-green-500 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-2">Total Portfolio Value</h3>
          <p className="text-4xl font-bold text-slate-800 mb-1">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-400 text-sm">Across all networks</p>
        </div>
      </div>

      {/* Asset Count Card */}
      <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-secondary opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 gradient-secondary rounded-2xl flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <span className="text-blue-500 text-sm font-bold bg-blue-100 px-3 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-2">Tracked Assets</h3>
          <p className="text-4xl font-bold text-slate-800 mb-3">{assetCount}</p>
          <div className="flex flex-wrap gap-1">
            {assetsList.slice(0, 6).map((symbol, i) => (
              <span key={symbol} className="text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                {symbol}
              </span>
            ))}
            {assetsList.length > 6 && (
              <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                +{assetsList.length - 6}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Network Distribution Card */}
      <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-tertiary opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 gradient-tertiary rounded-2xl flex items-center justify-center">
              <Network className="w-7 h-7 text-white" />
            </div>
            <span className="text-cyan-500 text-sm font-bold bg-cyan-100 px-3 py-1 rounded-full">Multi-chain</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-4">Network Distribution</h3>
          <div className="space-y-3">
            {chainBreakdown.slice(0, 2).map((chain, i) => {
              const percentage = totalValue > 0 ? (chain.value / totalValue) * 100 : 0;
              return (
                <div key={chain.chain} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-semibold text-slate-700">{chain.chain}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Protocol Exposure Card */}
      <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-quaternary opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 gradient-quaternary rounded-2xl flex items-center justify-center">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <span className="text-emerald-500 text-sm font-bold bg-emerald-100 px-3 py-1 rounded-full">Diversified</span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-2">Protocol Exposure</h3>
          <p className="text-4xl font-bold text-slate-800 mb-1">
            ${(summary.totalApps || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-400 text-sm">DeFi protocols</p>
        </div>
      </div>
    </div>
  );
}