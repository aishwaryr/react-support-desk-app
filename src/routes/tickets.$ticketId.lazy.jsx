import { createLazyFileRoute } from '@tanstack/react-router';
import { TicketDetailPage } from '../components/tickets/detail/TicketDetailPage';

export const Route = createLazyFileRoute('/tickets/$ticketId')({
  component: TicketDetailPage,
});
