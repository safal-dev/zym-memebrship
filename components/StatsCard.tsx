import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-rose-50 text-rose-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={cn(
            "text-xs font-medium mt-2",
            trendUp ? "text-emerald-600" : "text-rose-600"
          )}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className={cn("p-4 rounded-xl", colorStyles[color])}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}
