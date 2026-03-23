import { useRouterState } from '@tanstack/react-router';

const pathMap = {
  '/': 'Dashboard',
  '/tickets': 'Tickets',
};

export function TopNavbar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const secondSlash = pathname.indexOf('/', 1);
  const result = secondSlash === -1 ? pathname : pathname.slice(0, secondSlash);
  const pageTitle = pathMap[result] ?? 'Support Desk';
  return (
    <div className="top-navbar">
      <h1 className="page-title">{pageTitle}</h1>
    </div>
  );
}
