import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, X } from 'lucide-react';

interface AssetBreakdownProps {
  tokens: Array<{ symbol: string; balanceUSD: number }>;
}

const MODERN_COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
  '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3'
];

export default function AssetBreakdown({ tokens }: AssetBreakdownProps) {
  const [selectedAsset, setSelectedAsset] = useState<null | { name: string; value: number; percent: number; color: string }>(null);
  
  const data = tokens
    .filter(t => t.balanceUSD > 0)
    .map((t, index) => ({ 
      name: t.symbol, 
      value: t.balanceUSD,
      color: MODERN_COLORS[index % MODERN_COLORS.length]
    }));
  
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const handlePieClick = (_: any, index: number) => {
    const item = data[index];
    setSelectedAsset({
      name: item.name,
      value: item.value,
      percent: total ? (item.value / total) * 100 : 0,
      color: item.color
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = total ? (data.value / total) * 100 : 0;
      return (
        <div className="frosted-glass rounded-2xl p-4 shadow-xl border border-white/20">
          <p className="font-bold text-slate-800 text-lg">{data.name}</p>
          <p className="text-slate-600 font-semibold">
            ${data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-slate-500 text-sm">{percent.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="frosted-glass rounded-3xl p-8 card-hover card-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Asset Distribution</h2>
          <p className="text-slate-500 font-medium">Portfolio composition by asset type</p>
        </div>
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={140}
            innerRadius={60}
            paddingAngle={2}
            onClick={handlePieClick}
            className="cursor-pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Asset List */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {data.slice(0, 8).map((asset, index) => {
          const percent = total ? (asset.value / total) * 100 : 0;
          return (
            <div key={asset.name} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
                 onClick={() => handlePieClick(null, index)}>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{asset.name}</p>
                <p className="text-sm text-slate-500">{percent.toFixed(1)}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" 
             onClick={() => setSelectedAsset(null)}>
          <div className="frosted-glass rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl border border-white/20" 
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Asset Details</h3>
              <button onClick={() => setSelectedAsset(null)} 
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                   style={{ backgroundColor: selectedAsset.color }}>
                <span className="text-white font-bold text-xl">{selectedAsset.name.charAt(0)}</span>
              </div>
              
              <h4 className="text-3xl font-bold text-slate-800 mb-2">{selectedAsset.name}</h4>
              <p className="text-4xl font-extrabold mb-2" style={{ color: selectedAsset.color }}>
                ${selectedAsset.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-slate-500 font-semibold text-lg">
                {selectedAsset.percent.toFixed(2)}% of portfolio
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}