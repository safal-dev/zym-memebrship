'use client'
import { useState } from 'react';
import { Member } from '@/types';
import { formatCurrency, getStatusColor } from '@/lib/membership';
import { 
  Search, 
  MoreVertical, 
  Dumbbell, 
  Calendar, 
  Download,
  AlertCircle,
  History
} from 'lucide-react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/export-utils';

interface MemberTableProps {
  members: Member[];
}

export default function MemberTable({ members }: MemberTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'soon' | 'expired' | 'due'>('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'due') return matchesSearch && member.dueAmount > 0;
    return matchesSearch && member.status === filter;
  });

  const handleExport = () => {
    exportToCSV(filteredMembers, `members-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="flex flex-col gap-6 animate-in">
      {/* Header & Search (GymConnect Mobile Pattern) */}
      <section className="flex flex-col gap-4 sticky top-16 z-40 bg-background/95 backdrop-blur-sm pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-on-background">Member Directory</h2>
            <p className="text-sm text-on-surface-variant mt-1">Manage and search active memberships.</p>
          </div>
          <button 
            onClick={handleExport}
            className="w-12 h-12 flex items-center justify-center rounded-default bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, ID or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-tap-target-min pl-12 pr-4 rounded-default bg-surface border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-lg text-on-surface placeholder:text-on-surface-variant"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'active', 'soon', 'expired', 'due'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-shrink-0 px-5 h-9 rounded-full font-semibold text-sm whitespace-nowrap transition-all",
                filter === f 
                  ? "bg-primary-container text-on-primary-container shadow-sm" 
                  : "bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Member List (Mobile Card Pattern) */}
      <div className="flex flex-col gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Link 
              key={member.id} 
              href={`/members/${member.id}`}
              className="bg-surface-container-lowest rounded-default p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(37,99,235,0.05)] border border-white/40 active:scale-[0.98] transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg shrink-0 shadow-sm overflow-hidden">
                {member.photo ? (
                  <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-on-background truncate">{member.fullName}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ml-auto",
                    getStatusBadgeStyle(member.status)
                  )}>
                    {member.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span className="text-sm">{member.membershipPlan}</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
                  {member.status === 'expired' ? (
                    <History className="w-3.5 h-3.5" />
                  ) : member.dueAmount > 0 ? (
                    <AlertCircle className="w-3.5 h-3.5 text-error" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  <span className={cn(
                    "text-[12px]",
                    member.dueAmount > 0 ? "text-error font-medium" : "text-on-surface-variant"
                  )}>
                    {member.status === 'expired' ? `Expired: ${member.membershipEnd}` : `Expires: ${member.membershipEnd}`}
                    {member.dueAmount > 0 && ` • Due: ${formatCurrency(member.dueAmount, 'NPR')}`}
                  </span>
                </div>
              </div>
              
              <div className="text-outline group-hover:text-primary transition-colors">
                <MoreVertical className="w-5 h-5" />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
            <Search className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">No members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'active': return 'bg-secondary-container/30 text-secondary';
    case 'soon': return 'bg-warning-container/30 text-warning';
    case 'expired': return 'bg-surface-variant text-on-surface-variant';
    default: return 'bg-error-container/40 text-on-error-container';
  }
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
