'use client';

import { useState } from 'react';
import { Member } from '@/types';
import Link from 'next/link';
import { Search, Plus, Download, Eye, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getMemberStatus } from '@/lib/membership';
import { exportMembersToCSV } from '@/lib/export-utils';

export function MemberTable({ initialMembers }: { initialMembers: Member[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMembers = initialMembers.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
    
    if (filter === 'active') return matchesSearch && status === 'active';
    if (filter === 'expired') return matchesSearch && status === 'expired';
    if (filter === 'soon') return matchesSearch && status === 'soon';
    if (filter === 'due') return matchesSearch && m.dueAmount > 0;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in">
      {/* Editorial Navigation & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">Roster Management</span>
            <h1 className="text-4xl font-display font-black text-onyx-on-surface tracking-tighter">Member Directory</h1>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => exportMembersToCSV(filteredMembers)}
                className="p-3 bg-onyx-surface text-onyx-on-surface-variant hover:text-onyx-on-surface rounded-2xl transition-onyx shadow-lg"
                title="Export Data"
              >
                <Download className="w-6 h-6" />
              </button>
              <Link 
                href="/members/add" 
                className="group flex items-center gap-3 px-6 py-3 bg-onyx-primary text-onyx-on-primary rounded-full hover:scale-[1.02] transition-onyx shadow-xl shadow-onyx-primary/10"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">New Entry</span>
              </Link>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-onyx-on-surface-variant w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full pl-14 pr-6 py-5 bg-onyx-surface border-none rounded-[1.5rem] focus:ring-2 focus:ring-onyx-primary transition-onyx text-sm font-medium placeholder:text-onyx-outline shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
            {['all', 'active', 'soon', 'expired', 'due'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-onyx whitespace-nowrap",
                  filter === f 
                    ? "bg-onyx-tertiary text-onyx-background shadow-lg shadow-onyx-tertiary/20" 
                    : "bg-onyx-surface text-onyx-on-surface-variant hover:bg-onyx-surface-high"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roster Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((m) => {
          const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
          return (
            <Link 
              key={m.id} 
              href={`/members/${m.id}`}
              className="bg-onyx-surface p-6 rounded-[2rem] hover:bg-onyx-surface-high transition-onyx group relative overflow-hidden flex flex-col justify-between h-64"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-onyx-background flex items-center justify-center text-onyx-primary font-black text-2xl shadow-inner group-hover:scale-110 transition-onyx">
                  {m.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    status === 'active' && "bg-onyx-tertiary/10 text-onyx-tertiary",
                    status === 'soon' && "bg-orange-400/10 text-orange-400",
                    status === 'expired' && "bg-rose-400/10 text-rose-400"
                  )}>
                    {status}
                  </span>
                  {m.dueAmount > 0 && (
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                      DUE: {m.dueAmount}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div>
                <h4 className="text-2xl font-display font-black text-onyx-on-surface tracking-tight group-hover:text-onyx-primary transition-onyx truncate">
                  {m.fullName}
                </h4>
                <p className="text-xs font-bold text-onyx-on-surface-variant uppercase tracking-wider mt-1">{m.phone}</p>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-onyx-outline/5">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Plan Expiry</p>
                  <p className="text-sm font-bold text-onyx-on-surface">{format(new Date(m.membershipEnd), 'MMM dd, yyyy')}</p>
                </div>
                <div className="p-2 bg-onyx-background text-onyx-outline rounded-xl group-hover:text-onyx-tertiary transition-onyx">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-onyx" />
                </div>
              </div>
            </Link>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-20 bg-onyx-surface rounded-[2rem] flex flex-col items-center justify-center text-onyx-on-surface-variant gap-4">
            <Search className="w-12 h-12 text-onyx-outline/20" />
            <p className="font-display font-bold text-xl tracking-tight">No entities found</p>
            <p className="text-sm font-medium opacity-60">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
