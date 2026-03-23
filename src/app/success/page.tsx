import { saveOrderAndSendEmails } from '@/actions/saveOrder';
import ClearCartAndRender from './ClearCartAndRender';

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (sessionId) {
    try {
      await saveOrderAndSendEmails(sessionId);
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  }

  // ClearCartAndRender is a thin client component that just clears localStorage cart
  return <ClearCartAndRender />;
}