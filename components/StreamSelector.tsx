import React from 'react';
import { StreamType } from '../types';
import { STREAMS } from '../constants';

interface Props {
  selected: StreamType;
  onSelect: (stream: StreamType) => void;
}

const StreamSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-slate-700 mb-3">Select Immigration Stream</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            onClick={() => onSelect(stream.id)}
            className={`
              p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selected === stream.id 
                ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }
            `}
          >
            <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${selected === stream.id ? 'text-indigo-600' : 'text-slate-500'}`}>
              {stream.type} Stream
            </div>
            <div className={`font-medium ${selected === stream.id ? 'text-indigo-900' : 'text-slate-800'}`}>
              {stream.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StreamSelector;