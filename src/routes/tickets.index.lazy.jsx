import { createLazyFileRoute } from '@tanstack/react-router';
import { TicketsList } from '../components/tickets/list/TicketsList';

export const Route = createLazyFileRoute('/tickets/')({
  component: TicketsList,
});
