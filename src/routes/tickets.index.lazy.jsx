import { createLazyFileRoute } from '@tanstack/react-router';
import { TicketsList } from '../components/tickets/TicketsList';

export const Route = createLazyFileRoute('/tickets/')({
  component: TicketsList,
});
