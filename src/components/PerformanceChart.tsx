'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceTrendPoint {
  index: number;
  date: string;
  score: number;
  title: string;
  role: string;
  difficulty: string;
}

interface PerformanceChartProps {
  data: PerformanceTrendPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-navy-400">
        Complete your first mock interview to view historical trajectory.
      </div>
    );
  }

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" strokeOpacity={0.15} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            domain={[40, 100]}
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PerformanceTrendPoint;
                return (
                  <div className="p-3 rounded-2xl bg-white dark:bg-navy-900 shadow-xl border border-navy-100 dark:border-navy-800 text-xs space-y-1">
                    <p className="font-bold text-navy-900 dark:text-white">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-600 dark:text-brand-400 font-extrabold text-sm">
                        {item.score}%
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] text-navy-400">{item.role} • {item.date}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#4F46E5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
            dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#4338CA', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
