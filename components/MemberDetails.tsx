'use client'
import { Member, Payment, Settings } from '@/types';
import { formatCurrency } from '@/lib/membership';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Dumbbell, 
  Wallet,
  Receipt,
  RotateCcw,
  Trash2,
  Printer,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { deleteMember } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface MemberDetailsProps {
  member: Member;
  payments: Payment[];
  settings: Settings;
}

export default function MemberDetails({ member, payments, settings }: MemberDetailsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this member? All data will be lost.')) {
      await deleteMember(member.id);
      router.push('/members');
    }
  };

  const handlePrint = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${payment.id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #191b23; }
            .header { border-bottom: 2px solid #004ac6; padding-bottom: 20px; margin-bottom: 30px; }
            .gym-name { font-size: 24px; font-weight: 800; color: #004ac6; }
            .receipt-title { font-size: 18px; font-weight: 700; margin-top: 10px; }
            .details { margin-bottom: 30px; }
            .row { display: flex; justify-between: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .label { font-weight: 600; color: #737686; }
            .amount { font-size: 20px; font-weight: 800; color: #006c49; margin-top: 20px; }
            .footer { margin-top: 50px; font-size: 12px; color: #737686; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="gym-name">${settings.gymName}</div>
            <div class="receipt-title">OFFICIAL PAYMENT RECEIPT</div>
          </div>
          <div class="details">
            <div class="row"><span class="label">Receipt ID:</span> <span>${payment.id}</span></div>
            <div class="row"><span class="label">Date:</span> <span>${payment.paymentDate}</span></div>
            <div class="row"><span class="label">Member Name:</span> <span>${payment.memberName}</span></div>
            <div class="row"><span class="label">Member ID:</span> <span>${payment.memberId}</span></div>
            <div class="row"><span class="label">Payment Method:</span> <span>${payment.method.toUpperCase()}</span></div>
          </div>
          <div class="amount">Total Amount: ${formatCurrency(payment.amount, settings.currency)}</div>
          <div class="footer">Thank you for choosing ${settings.gymName}!</div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const paymentProgress = Math.min(Math.round((member.paidAmount / member.totalFee) * 100), 100);

  return (
    <div className="flex flex-col gap-8 animate-in pb-32">
      {/* Profile Hero (GymConnect Style) */}
      <section className="glass-card rounded-[2rem] p-6 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary text-4xl font-black">
            {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1 space-y-2 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <h1 className="text-[32px] font-black text-on-background leading-tight">{member.fullName}</h1>
              <p className="text-sm font-bold text-outline">ID: {member.id}</p>
            </div>
            <div className="flex justify-center md:justify-end gap-2 mt-2 md:mt-0">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-bold text-[11px] tracking-wider uppercase ${
                member.status === 'active' ? 'bg-secondary-container/30 text-secondary' : 
                member.status === 'expired' ? 'bg-surface-variant text-on-surface-variant' :
                'bg-red-50 text-red-600'
              }`}>
                {member.status}
              </span>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant flex items-center justify-center md:justify-start gap-2 font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Joined {new Date(member.joinDate).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Information Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <section className="glass-card rounded-[2rem] p-8 space-y-6">
          <h3 className="text-xl font-bold text-on-background flex items-center gap-3">
            <Phone className="w-6 h-6 text-primary" />
            Contact Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-outline uppercase">Phone</p>
                <p className="text-sm font-bold text-on-surface">{member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-outline uppercase">Address</p>
                <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{member.address}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Plan */}
        <section className="glass-card rounded-[2rem] p-8 space-y-6">
          <h3 className="text-xl font-bold text-on-background flex items-center gap-3">
            <Dumbbell className="w-6 h-6 text-primary" />
            Current Plan
          </h3>
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/50 h-[calc(100%-48px)] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold tracking-widest text-primary uppercase">MEMBERSHIP TYPE</p>
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-2xl font-black text-on-surface">{member.membershipPlan}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <p className="text-sm text-on-surface-variant flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" />
                Renews: <span className="font-bold text-on-surface">{new Date(member.membershipEnd).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Financial Summary */}
      <section className="glass-card rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-background flex items-center gap-3">
            <Wallet className="w-6 h-6 text-primary" />
            Financial Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-0 divide-x divide-outline-variant/30 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 overflow-hidden shadow-sm">
          <div className="p-6 text-center">
            <p className="text-[10px] font-bold text-outline mb-2 uppercase tracking-widest">Total</p>
            <p className="text-xl font-black text-on-surface">{formatCurrency(member.totalFee, settings.currency)}</p>
          </div>
          <div className="p-6 text-center bg-secondary/5">
            <p className="text-[10px] font-bold text-secondary mb-2 uppercase tracking-widest">Paid</p>
            <p className="text-xl font-black text-secondary">{formatCurrency(member.paidAmount, settings.currency)}</p>
          </div>
          <div className="p-6 text-center bg-red-50">
            <p className="text-[10px] font-bold text-red-600 mb-2 uppercase tracking-widest">Due</p>
            <p className="text-xl font-black text-red-600">{formatCurrency(member.dueAmount, settings.currency)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold text-outline mb-2 uppercase tracking-widest px-1">
            <span>Payment Progress</span>
            <span className="text-secondary">{paymentProgress}%</span>
          </div>
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-1000" 
              style={{ width: `${paymentProgress}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Payment Timeline */}
      <section className="glass-card rounded-[2rem] p-8 space-y-6">
        <h3 className="text-xl font-bold text-on-background flex items-center gap-3">
          <Receipt className="w-6 h-6 text-primary" />
          Recent Payments
        </h3>
        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.id} className="flex gap-4 relative pb-6 group">
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-surface-variant/50"></div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm">
                  <CreditCard className="w-5 h-5 text-on-surface-variant" />
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-2xl p-4 flex justify-between items-center shadow-sm border border-outline-variant/20 hover:border-primary/30 transition-all">
                  <div>
                    <p className="font-bold text-on-surface">Payment Received</p>
                    <p className="text-sm text-outline">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-secondary">+{formatCurrency(payment.amount, settings.currency)}</span>
                    <button 
                      onClick={() => handlePrint(payment)}
                      className="text-outline hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-on-surface-variant">No payments recorded yet.</p>
          )}
        </div>
      </section>

      {/* Fixed Bottom Quick Actions (GymConnect Mobile Bottom Sheet) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-3xl rounded-t-[3rem] border-t border-outline-variant/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[60] p-6 pb-10">
        <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-8"></div>
        <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
          <button className="h-16 bg-primary text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black">Renew</span>
          </button>
          <button className="h-16 bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all">
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black">Pay</span>
          </button>
          <button className="h-16 bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all">
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black">Logs</span>
          </button>
          <button 
            onClick={handleDelete}
            className="h-16 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-red-100 active:scale-95 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
