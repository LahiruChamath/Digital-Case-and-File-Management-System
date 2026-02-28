import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Litigation', value: 40, color: '#3b82f6' },
  { name: 'Notarial', value: 20, color: '#ef4444' },
  { name: 'Oath Comm.', value: 15, color: '#22c55e' },
  { name: 'Secretarial', value: 25, color: '#f59e0b' },
];

const CaseDistributionChart = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseDistributionChart;