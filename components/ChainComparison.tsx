import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Link } from 'lucide-react';

interface ChainComparisonProps {
  chainBreakdown: Array<{ chain: string; value: number }>;
}

export default function ChainComparison({ chainBreakdown }: ChainComparisonProps) {
  const total = chainBreakdown.reduce((sum, chain) => sum + chain.value, 0);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percent = total ? (value / total) * 100 : 0;
      return (
        <div className="frosted-glass rounded-2xl p-4 shadow-xl border border-white/20">
          <p className="font-bold text-slate-800 text-lg">{label}</p>
          <p className="text-slate-600 font-semibold">
            ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-500 text-sm">{percent.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Add color picking function
  const getChainColor = (chain: string) => {
    if (chain.toLowerCase().includes('eth')) return '#3b82f6'; // blue for Ethereum
    if (chain.toLowerCase().includes('celo')) return '#22c55e'; // green for Celo
    return '#94a3b8'; // gray for others
  };

  return (
    <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Network Analysis</h2>
          <p className="text-slate-500 font-medium">Cross-chain portfolio distribution</p>
        </div>
        <div className="w-12 h-12 gradient-tertiary rounded-2xl flex items-center justify-center">
          <Link className="w-6 h-6 text-white" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chainBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="chainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis 
            dataKey="chain" 
            stroke="#64748b" 
            fontSize={14}
            fontWeight={600}
            tick={{ fill: '#475569' }}
          />
          <YAxis 
            tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} 
            stroke="#64748b" 
            fontSize={14}
            fontWeight={600}
            tick={{ fill: '#475569' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} className="hover:opacity-80 transition-opacity">
            {chainBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getChainColor(entry.chain)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Chain Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {chainBreakdown.map((chain, index) => {
          const percent = total ? (chain.value / total) * 100 : 0;
          const isEthereum = chain.chain.toLowerCase().includes('eth');
          
          return (
            <div key={chain.chain} className="p-4 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${isEthereum ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <span className="font-bold text-slate-800">{chain.chain}</span>
                </div>
                <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {percent.toFixed(1)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-700">
                ${chain.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}