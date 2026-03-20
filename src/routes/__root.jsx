import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Appshell } from '../components/layout/AppShell';

function RootLayout() {
  return (
    <Appshell>
      <Outlet />
    </Appshell>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
