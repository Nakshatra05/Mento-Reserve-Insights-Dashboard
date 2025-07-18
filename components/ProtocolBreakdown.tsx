import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface Protocol {
  name: string;
  category: string;
  network: string;
  totalValue: number;
  positionCount: number;
}

interface ProtocolBreakdownProps {
  protocols: Protocol[];
}

export default function ProtocolBreakdown({ protocols }: ProtocolBreakdownProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const data = protocols.map(p => ({ 
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name, 
    fullName: p.name,
    value: p.totalValue,
    category: p.category,
    network: p.network
  }));

  const categories = [...new Set(protocols.map(p => p.category))];
  const displayedProtocols = showAll ? protocols : protocols.slice(0, 6);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Lending': 'from-blue-400 to-blue-600',
      'DEX': 'from-purple-400 to-purple-600',
      'Staking': 'from-green-400 to-green-600',
      'Savings': 'from-yellow-400 to-yellow-600',
      'Other': 'from-gray-400 to-gray-600'
    };
    return colors[category] || colors['Other'];
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'Lending': 'bg-blue-100 text-blue-800 border-blue-200',
      'DEX': 'bg-purple-100 text-purple-800 border-purple-200',
      'Staking': 'bg-green-100 text-green-800 border-green-200',
      'Savings': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['Other'];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="frosted-glass rounded-2xl p-4 shadow-xl border border-white/20">
          <p className="font-bold text-slate-800 text-lg">{data.fullName}</p>
          <p className="text-slate-600 font-semibold">
            ${data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getCategoryBadgeColor(data.category)}`}>
              {data.category}
            </span>
            <span className="text-xs text-slate-500">{data.network}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Protocol Exposure</h2>
          <p className="text-slate-500 font-medium">DeFi protocol distribution and risk analysis</p>
        </div>
        <div className="w-12 h-12 gradient-quaternary rounded-2xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            selectedCategory === null 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
              : 'bg-white/50 text-slate-600 hover:bg-white/70'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'bg-white/50 text-slate-600 hover:bg-white/70'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
          <defs>
            <linearGradient id="protocolGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f093fb" />
              <stop offset="100%" stopColor="#f5576c" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis 
            type="number" 
            tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} 
            stroke="#64748b" 
            fontSize={14}
            fontWeight={600}
            tick={{ fill: '#475569' }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            stroke="#64748b" 
            fontSize={12}
            fontWeight={600}
            tick={{ fill: '#475569' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#protocolGradient)" 
            radius={[0, 8, 8, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Protocol Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Detailed Breakdown</h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <span>{showAll ? 'Show Less' : 'Show All'}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white/30 backdrop-blur-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="px-6 py-4 text-left font-bold text-slate-700">Protocol</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Category</th>
                <th className="px-6 py-4 text-left font-bold text-slate-700">Network</th>
                <th className="px-6 py-4 text-right font-bold text-slate-700">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {displayedProtocols
                .filter(p => !selectedCategory || p.category === selectedCategory)
                .map((protocol, index) => (
                <tr key={protocol.name} className="border-t border-white/20 hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${getCategoryColor(protocol.category)}`}></div>
                      <span className="font-semibold text-slate-800">{protocol.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryBadgeColor(protocol.category)}`}>
                      {protocol.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-600">{protocol.network}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-slate-800 text-lg">
                      ${protocol.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}