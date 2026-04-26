import { getPayments, getSettings } from '@/lib/fileDb';
import { PaymentTable } from '@/components/PaymentTable';

export default async function PaymentsPage() {
  const payments = await getPayments();
  const settings = await getSettings();

  // Sort payments by date (newest first)
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );

  return (
    <div className="space-y-6">
      <PaymentTable payments={sortedPayments} settings={settings} />
    </div>
  );
}
