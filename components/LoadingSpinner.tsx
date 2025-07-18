import { Loader2, Database } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-32 h-32 rounded-full border-4 border-purple-200 animate-spin">
          <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
        </div>
        
        {/* Inner content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center animate-pulse-slow">
            <Database className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-800">Loading Portfolio Data</h2>
        <p className="text-slate-600 font-medium max-w-md">
          Fetching real-time analytics from multiple blockchain networks...
        </p>
        
        {/* Progress indicators */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <span className="text-sm text-slate-500 font-medium">Ethereum</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <span className="text-sm text-slate-500 font-medium">Celo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm text-slate-500 font-medium">Protocols</span>
          </div>
        </div>
      </div>
    </div>
  );
}