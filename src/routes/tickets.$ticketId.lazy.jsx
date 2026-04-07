import { createLazyFileRoute } from '@tanstack/react-router';
import { TicketDetailPage } from '../components/tickets/TicketDetailPage';

export const Route = createLazyFileRoute('/tickets/$ticketId')({
  component: TicketDetailPage,
});
