import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  active?: boolean;
}

const InputSection: React.FC<Props> = ({ title, children, active = true }) => {
  if (!active) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center">
        {title}
      </h3>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default InputSection;