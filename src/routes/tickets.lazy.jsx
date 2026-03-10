import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/tickets')({
  component: Tickets,
});

function Tickets() {
  return <h1>Hello "/tickets"!</h1>;
}
