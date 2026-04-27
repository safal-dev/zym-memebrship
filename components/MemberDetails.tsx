'use client';

import { useState } from 'react';
import { Member, Payment, Settings } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { getMemberStatus, formatCurrency } from '@/lib/membership';
import { cn } from '@/lib/utils';
import { renewMembership, addPayment, deleteMember } from '@/app/actions';
import { Phone, MapPin, AlertCircle, CheckCircle, Trash2, Printer, ChevronLeft, CreditCard, Calendar, User, DollarSign, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export function MemberDetails({ member, payments, settings }: { member: Member, payments: Payment[], settings: Settings }) {
  const router = useRouter();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const status = getMemberStatus(member.membershipEnd, member.dueAmount, member.status);
  const remainingDays = differenceInDays(new Date(member.membershipEnd), new Date());
  
  const [renewPlan, setRenewPlan] = useState(settings.defaultPlans[0]?.name || 'Monthly');
  const [renewPayment, setRenewPayment] = useState('');
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNote, setPaymentNote] = useState('');

  const [loading, setLoading] = useState(false);

  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Trace ID: ${payment.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Manrope:wght@800&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 60px; color: #131316; background: #fff; line-height: 1.6; }
            .header { text-align: center; border-bottom: 4px solid #131316; padding-bottom: 40px; margin-bottom: 50px; }
            .header h1 { font-family: 'Manrope', sans-serif; font-size: 3rem; margin: 0; letter-spacing: -0.04em; text-transform: uppercase; }
            .header p { margin: 5px 0; font-weight: bold; color: #66dd8b; letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.8rem; }
            .details { margin-bottom: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .col { display: flex; flex-direction: column; }
            .label { font-size: 0.7rem; font-weight: 900; color: #8e9196; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
            .val { font-weight: 700; color: #131316; font-size: 1.1rem; }
            .amount-section { border-top: 2px solid #f1f5f9; padding-top: 30px; text-align: right; }
            .total-label { font-size: 0.8rem; font-weight: 900; color: #8e9196; text-transform: uppercase; }
            .total-val { font-family: 'Manrope', sans-serif; font-size: 3.5rem; color: #131316; letter-spacing: -0.04em; margin: 10px 0; }
            .footer { margin-top: 100px; text-align: center; font-size: 0.7rem; font-weight: bold; color: #8e9196; border-top: 1px solid #f1f5f9; padding-top: 30px; text-transform: uppercase; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.gymName}</h1>
            <p>Official Payment Timeline Record</p>
          </div>
          <div class="details">
            <div class="col">
                <span class="label">Trace ID</span>
                <span class="val">${payment.id}</span>
            </div>
            <div class="col">
                <span class="label">Timeline Sync</span>
                <span class="val">${format(new Date(payment.paymentDate), 'MMMM dd, yyyy')}</span>
            </div>
            <div class="col">
                <span class="label">Account Identity</span>
                <span class="val">${payment.memberName} (${payment.memberId})</span>
            </div>
            <div class="col">
                <span class="label">Inflow Method</span>
                <span class="val">${payment.method.toUpperCase()}</span>
            </div>
          </div>
          <div class="amount-section">
            <span class="total-label">Final Captured Revenue</span>
            <div class="total-val">${formatCurrency(payment.amount, settings.currency)}</div>
          </div>
          <div class="footer">
            <p>Sanctuary Management Systems &copy; ${new Date().getFullYear()}</p>
            <p>Verification Code: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await renewMembership(member.id, renewPlan, format(new Date(), 'yyyy-MM-dd'), parseFloat(renewPayment) || 0, 'cash');
      setShowRenewModal(false);
      toast.success('Renewal synchronized');
    } catch (error) {
      toast.error('Sync failure');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPayment(member.id, parseFloat(paymentAmount), paymentMethod, paymentNote);
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentNote('');
      toast.success('Inflow recorded');
    } catch (error) {
      toast.error('Record failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in pb-12">
      {/* Editorial Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/members" className="p-4 bg-onyx-surface rounded-2xl text-onyx-on-surface-variant hover:text-onyx-on-surface transition-onyx shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">Entity Profile</span>
            <h1 className="text-3xl md:text-4xl font-display font-black text-onyx-on-surface tracking-tighter">Member Dossier</h1>
          </div>
        </div>
      </div>

      {/* Hero Identity Card */}
      <div className="bg-onyx-surface rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-onyx group-hover:opacity-20">
          <User className="w-48 h-48" />
        </div>
        
        <div className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex gap-8 items-center">
              <div className="w-28 h-28 rounded-[2rem] bg-onyx-background flex items-center justify-center text-onyx-primary font-display font-black text-4xl shadow-inner border border-onyx-outline/5">
                {member.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-3 mb-2">
                  <span className={cn(
                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    status === 'active' && "bg-onyx-tertiary/10 text-onyx-tertiary",
                    status === 'soon' && "bg-orange-400/10 text-orange-400",
                    status === 'expired' && "bg-rose-400/10 text-rose-400"
                  )}>
                    {status}
                  </span>
                  {member.dueAmount > 0 && (
                    <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-400 text-onyx-background shadow-lg shadow-rose-400/20">
                      DUE: {formatCurrency(member.dueAmount, settings.currency)}
                    </span>
                  )}
                </div>
                <h2 className="text-4xl font-display font-black text-onyx-on-surface tracking-tighter">{member.fullName}</h2>
                <p className="text-sm font-bold text-onyx-on-surface-variant uppercase tracking-widest">TRACE ID: {member.id}</p>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button onClick={() => setShowRenewModal(true)} className="flex-1 md:flex-none px-10 py-5 bg-gradient-to-r from-onyx-primary to-[#78839c] text-onyx-on-primary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-onyx shadow-xl shadow-onyx-primary/10 font-black text-xs uppercase tracking-widest">
                SYNCHRONIZE RENEWAL
              </button>
              <button onClick={() => setShowPaymentModal(true)} className="flex-1 md:flex-none px-10 py-5 bg-onyx-background text-onyx-on-surface rounded-full hover:bg-onyx-surface-high transition-onyx font-black text-xs uppercase tracking-widest shadow-lg">
                RECORD FLOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Intelligence */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-onyx-on-surface-variant uppercase">Communications</span>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Contact Intelligence</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-onyx-background flex items-center justify-center text-onyx-on-surface-variant group-hover:text-onyx-primary transition-onyx">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Secure Line</p>
                <p className="font-bold text-lg text-onyx-on-surface tracking-tight">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-onyx-background flex items-center justify-center text-onyx-on-surface-variant group-hover:text-onyx-primary transition-onyx">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Geospatial Point</p>
                <p className="font-bold text-lg text-onyx-on-surface tracking-tight">{member.address || 'N/A'}</p>
              </div>
            </div>
            {member.notes && (
              <div className="pt-6 border-t border-onyx-outline/5">
                <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider mb-3">INTERNAL DOSSIER</p>
                <p className="text-sm text-onyx-on-surface-variant leading-relaxed italic">"{member.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Membership Architecture */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-onyx-on-surface-variant uppercase">Schedules</span>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Plan Architecture</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-onyx-background p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Tier</p>
                  <p className="text-2xl font-display font-black text-onyx-on-surface tracking-tight">{member.membershipPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Status</p>
                  <p className={cn(
                    "text-xl font-display font-black tracking-tight",
                    status === 'expired' ? 'text-rose-400' : 'text-onyx-tertiary'
                  )}>{status === 'expired' ? 'EXPIRED' : `${remainingDays} DAYS`}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Initialize</p>
                <p className="font-bold text-onyx-on-surface">{format(new Date(member.membershipStart), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-onyx-outline uppercase tracking-wider">Termination</p>
                <p className="font-bold text-onyx-on-surface">{format(new Date(member.membershipEnd), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Dynamics */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-onyx-on-surface-variant uppercase">Ledger</span>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Fiscal Dynamics</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-[10px] font-black text-onyx-outline uppercase tracking-widest">Gross Revenue</span>
              <span className="font-bold text-onyx-on-surface">{formatCurrency(member.totalFee, settings.currency)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[10px] font-black text-onyx-outline uppercase tracking-widest">Captured Inflow</span>
              <span className="font-bold text-onyx-tertiary">{formatCurrency(member.paidAmount, settings.currency)}</span>
            </div>
            <div className="pt-6 border-t border-onyx-outline/5 flex justify-between items-end">
              <span className="text-xs font-black text-onyx-on-surface uppercase tracking-[0.2em]">Net Owed</span>
              <span className={cn(
                "text-4xl font-display font-black tracking-tighter",
                member.dueAmount > 0 ? "text-rose-400" : "text-onyx-tertiary"
              )}>{formatCurrency(member.dueAmount, settings.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Timeline */}
      <div className="bg-onyx-surface rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-10 border-b border-onyx-outline/5 flex justify-between items-center">
            <div className="space-y-1">
                <span className="text-[10px] font-black tracking-[0.2em] text-onyx-on-surface-variant uppercase">Traceability</span>
                <h3 className="text-xl font-display font-black text-onyx-on-surface">Fiscal History</h3>
            </div>
        </div>
        <div className="divide-y divide-onyx-outline/5">
          {payments.length === 0 ? (
            <div className="p-20 text-center text-onyx-on-surface-variant italic font-display">No fiscal events logged</div>
          ) : (
            payments.map(p => (
              <div key={p.id} className="p-8 flex justify-between items-center hover:bg-onyx-background/40 transition-onyx group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-onyx-background flex items-center justify-center text-onyx-tertiary shadow-inner border border-onyx-outline/5">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-black text-xl text-onyx-on-surface tracking-tight">{formatCurrency(p.amount, settings.currency)}</p>
                    <p className="text-[10px] text-onyx-on-surface-variant font-black uppercase tracking-[0.1em] mt-0.5">{format(new Date(p.paymentDate), 'MMM dd, yyyy')} • {p.method}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                    <button 
                    onClick={() => handlePrint(p)}
                    className="p-4 bg-onyx-background text-onyx-outline hover:text-onyx-primary rounded-2xl transition-onyx shadow-lg group-hover:scale-110"
                    >
                    <Printer className="w-5 h-5" />
                    </button>
                    <button className="p-4 bg-onyx-background text-onyx-outline hover:text-onyx-primary rounded-2xl transition-onyx shadow-lg group-hover:scale-110">
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals with Kinetic Styling */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-8 z-[100] backdrop-blur-xl animate-in">
          <form onSubmit={handleRenew} className="bg-onyx-surface rounded-t-[3rem] sm:rounded-[3rem] p-10 w-full max-w-xl shadow-2xl animate-slide-up">
            <div className="w-16 h-1.5 bg-onyx-surface-highest rounded-full mx-auto mb-10 sm:hidden" />
            <h3 className="text-3xl font-display font-black text-onyx-on-surface tracking-tighter mb-8 text-center sm:text-left">Synchronize <br className="sm:hidden" /> Membership</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Architectural Plan</label>
                <select 
                  value={renewPlan} 
                  onChange={(e) => {
                    const plan = settings.defaultPlans.find(p => p.name === e.target.value);
                    setRenewPlan(e.target.value);
                    if (plan) setRenewPayment(plan.price.toString());
                  }}
                  className="w-full px-6 py-5 bg-onyx-background border-none rounded-[1.5rem] focus:ring-2 focus:ring-onyx-primary font-bold text-lg text-onyx-on-surface shadow-inner appearance-none"
                >
                  {settings.defaultPlans.map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.months} Month Cycle)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Fiscal Capture ({settings.currency})</label>
                <input 
                  type="number" 
                  value={renewPayment} 
                  onChange={(e) => setRenewPayment(e.target.value)}
                  className="w-full px-6 py-5 bg-onyx-background border-none rounded-[1.5rem] focus:ring-2 focus:ring-onyx-primary font-display font-black text-2xl text-onyx-tertiary shadow-inner"
                />
              </div>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={loading} className="flex-1 py-6 bg-gradient-to-r from-onyx-primary to-[#78839c] text-onyx-on-primary rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-onyx-primary/20">
                {loading ? 'SYNCHRONIZING...' : 'CONFIRM RENEWAL'}
              </button>
              <button type="button" onClick={() => setShowRenewModal(false)} className="px-10 py-6 bg-onyx-background text-onyx-on-surface-variant rounded-full font-black text-xs tracking-[0.2em] uppercase hover:text-onyx-on-surface transition-onyx">
                ABORT
              </button>
            </div>
          </form>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-8 z-[100] backdrop-blur-xl animate-in">
          <form onSubmit={handlePayment} className="bg-onyx-surface rounded-t-[3rem] sm:rounded-[3rem] p-10 w-full max-w-xl shadow-2xl animate-slide-up">
            <div className="w-16 h-1.5 bg-onyx-surface-highest rounded-full mx-auto mb-10 sm:hidden" />
            <h3 className="text-3xl font-display font-black text-onyx-on-surface tracking-tighter mb-8 text-center sm:text-left">Capture <br className="sm:hidden" /> Fiscal Inflow</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Inflow Volume ({settings.currency})</label>
                <input 
                  required
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-6 py-5 bg-onyx-background border-none rounded-[1.5rem] focus:ring-2 focus:ring-onyx-primary font-display font-black text-3xl text-onyx-tertiary shadow-inner"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Capture Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-sm text-onyx-on-surface shadow-inner appearance-none">
                    <option value="cash">PHYSICAL CASH</option>
                    <option value="card">DEBIT/CREDIT CARD</option>
                    <option value="bank">BANKING TRANSFER</option>
                    <option value="digital_wallet">DIGITAL ARCHIVE</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Annotation</label>
                    <input 
                    type="text" 
                    value={paymentNote} 
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-sm text-onyx-on-surface shadow-inner"
                    placeholder="E.G. PARTIAL CAPTURE"
                    />
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={loading} className="flex-1 py-6 bg-onyx-tertiary text-onyx-background rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-onyx-tertiary/20">
                {loading ? 'PROCESSING...' : 'RECORD FISCAL EVENT'}
              </button>
              <button type="button" onClick={() => setShowPaymentModal(false)} className="px-10 py-6 bg-onyx-background text-onyx-on-surface-variant rounded-full font-black text-xs tracking-[0.2em] uppercase hover:text-onyx-on-surface transition-onyx">
                ABORT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
