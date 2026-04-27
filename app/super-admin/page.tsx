import { requireSuperAdmin } from '@/lib/auth';
import { getAllGyms } from './actions';
import { 
  Users, 
  DollarSign, 
  Building2, 
  ArrowUpRight, 
  Plus, 
  MoreHorizontal,
  Activity,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/membership';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default async function SuperAdminDashboard() {
  await requireSuperAdmin();
  const gyms = await getAllGyms();

  const totalRevenue = gyms.reduce((acc, g) => acc + (g.totalRevenue || 0), 0);
  const totalMembers = gyms.reduce((acc, g) => acc + (g.totalMembers || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Platform Command Center</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Super Admin Dashboard</h1>
        </div>
        <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200">
          <Plus className="w-5 h-5" />
          Provision New Gym
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Platform Revenue</p>
            <h3 className="text-3xl font-black text-gray-900">NRS {totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Active Gyms</p>
            <h3 className="text-3xl font-black text-gray-900">{gyms.length}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Memberships</p>
            <h3 className="text-3xl font-black text-gray-900">{totalMembers.toLocaleString()}</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Gym List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Managed Gyms</h2>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            <Activity className="w-3 h-3" />
            All Systems Operational
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Gym Name & Owner</th>
                <th className="px-8 py-5">Plan Status</th>
                <th className="px-8 py-5">Members</th>
                <th className="px-8 py-5">Revenue</th>
                <th className="px-8 py-5 text-right">Expiry Date</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-gray-900">{gym.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{gym.ownerEmail}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        gym.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      )} />
                      <span className="text-xs font-black uppercase tracking-widest">{gym.planName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-600">{gym.totalMembers}</td>
                  <td className="px-8 py-6 font-black text-emerald-600">NRS {gym.totalRevenue?.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-bold text-gray-400 text-xs">
                    {format(new Date(gym.expiryDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
