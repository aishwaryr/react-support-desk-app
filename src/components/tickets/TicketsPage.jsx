import { Outlet } from '@tanstack/react-router';
import './tickets.css';

export function TicketsPage() {
  return (
    <div className="page tickets-page">
      <Outlet />
    </div>
  );
}
