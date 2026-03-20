import { Link } from '@tanstack/react-router';

export function Sidebar() {
  return (
    <div className="sidebar">
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/tickets">Tickets</Link>
      </nav>
    </div>
  );
}
