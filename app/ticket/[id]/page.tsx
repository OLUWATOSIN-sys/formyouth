import { getRegistration } from '@/lib/db';
import { notFound } from 'next/navigation';
import TicketView from '@/components/TicketView';

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registration = await getRegistration(id);

  if (!registration) {
    notFound();
  }

  return <TicketView registration={registration} />;
}
