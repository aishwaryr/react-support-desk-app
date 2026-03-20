import { createLazyFileRoute } from '@tanstack/react-router';
import { TicketsPage } from '../components/tickets/TicketsPage';

export const Route = createLazyFileRoute('/tickets')({
  component: TicketsPage,
});
