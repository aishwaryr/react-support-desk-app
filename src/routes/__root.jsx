import { createRootRoute, Outlet, Link } from '@tanstack/react-router';

function RootLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/tickets">Tickets</Link>
      </nav>
      <Outlet></Outlet>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
