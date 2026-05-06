import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { Appshell } from '../components/layout/AppShell';
import Modal from '../components/layout/Modal';

function RootLayout() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const activeModal = useRouterState({
    select: (s) => s.location.search?.modal,
  });
  const isCreateTicketOpen = activeModal === 'create-ticket';

  function closeModal() {
    navigate({
      to: location.pathname,
      search: (prev) => ({ ...prev, modal: undefined }),
    });
  }

  return (
    <Appshell>
      <Outlet />

      {isCreateTicketOpen && (
        <Modal onClose={closeModal}>
          <div>
            <h2> Create Ticket</h2>
            <button type="button" onClick={closeModal}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </Appshell>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
