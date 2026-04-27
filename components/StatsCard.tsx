import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-onyx-surface p-6 rounded-[1.5rem] shadow-sm relative overflow-hidden group hover:bg-onyx-surface-high transition-onyx">
      {/* Subtle Background Icon Decoration */}
      <Icon className="absolute -right-4 -bottom-4 w-24 h-24 text-onyx-outline/5 transition-onyx group-hover:scale-110 group-hover:text-onyx-outline/10" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-onyx-background text-onyx-on-surface-variant group-hover:text-onyx-tertiary transition-onyx">
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-onyx-on-surface-variant">
            {title}
          </p>
        </div>
        
        <div>
          <h3 className="stats-value text-4xl text-onyx-tertiary">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
