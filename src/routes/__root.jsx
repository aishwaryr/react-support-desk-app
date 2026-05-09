import {
  createRootRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { Appshell } from '../components/layout/AppShell';
import Modal from '../components/layout/Modal';
import { CreateTicketForm } from '../components/create-ticket-form/CreateTicketForm';

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
          <CreateTicketForm onClose={closeModal} />
        </Modal>
      )}
    </Appshell>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
