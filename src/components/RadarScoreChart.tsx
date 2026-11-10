'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarScoreChartProps {
  data: Array<{
    subject: string;
    score: number;
    fullMark?: number;
  }>;
}

export default function RadarScoreChart({ data }: RadarScoreChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-navy-400">
        No skill dimensions available
      </div>
    );
  }

  // Abbreviate labels slightly for clean mobile rendering
  const formattedData = data.map((d) => ({
    ...d,
    shortSubject: d.subject.replace(' Approach', '').replace(' Accuracy', ''),
  }));

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={formattedData}>
          <PolarGrid stroke="#94A3B8" strokeOpacity={0.25} />
          <PolarAngleAxis
            dataKey="shortSubject"
            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94A3B8', fontSize: 9 }}
            strokeOpacity={0.2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-navy-900 shadow-xl border border-navy-100 dark:border-navy-800 text-xs">
                    <p className="font-semibold text-navy-900 dark:text-white">{item.subject}</p>
                    <p className="text-brand-600 dark:text-brand-400 font-bold mt-0.5">
                      Score: {item.score}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Radar
            name="Proficiency"
            dataKey="score"
            stroke="#6366F1"
            fill="#818CF8"
            fillOpacity={0.45}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
