import TicketDetailHeader from './TicketDetailHeader.jsx';
import TicketDetailMessages from './TicketDetailMessages.jsx';

const DUMMY_TICKET = {
  id: 't_demo_001',
  publicId: 'T-0042',
  subject: 'Unable to access billing invoices for March',
  customerName: 'Aarav Sharma',
  customerEmail: 'aarav.sharma@example.com',
  priority: 'high',
  status: 'in_progress',
  createdAt: 'Apr 05, 2026 09:15 AM',
  updatedAt: 'Apr 07, 2026 02:20 PM',
};

const DUMMY_MESSAGES = [
  {
    id: 'm_demo_001',
    sender: 'Customer',
    createdAt: 'Apr 05, 2026 09:16 AM',
    message:
      'Hi team, my March invoices are not loading in billing settings. It keeps showing a blank area.',
  },
  {
    id: 'm_demo_002',
    sender: 'Agent',
    createdAt: 'Apr 05, 2026 10:02 AM',
    message:
      'Thanks for reporting this. Could you confirm if this happens in both Chrome and Safari?',
  },
  {
    id: 'm_demo_003',
    sender: 'Customer',
    createdAt: 'Apr 05, 2026 10:14 AM',
    message:
      'Yes, I tested both. Same issue. I can view February invoices, but March fails every time.',
  },
  {
    id: 'm_demo_004',
    sender: 'Agent',
    createdAt: 'Apr 07, 2026 02:20 PM',
    message:
      'Got it. We identified the issue with invoice permissions. A fix is in progress and should be live shortly.',
  },
];

export function TicketDetailPage() {
  return (
    <div className="page tickets-page">
      <div className="ticket-detail-shell">
        <TicketDetailHeader ticket={DUMMY_TICKET} />

        <div className="ticket-detail-grid">
          <TicketDetailMessages messages={DUMMY_MESSAGES} />

          <aside className="ticket-detail-sidebar">
            <section className="ticket-side-card">
              <h3 className="ticket-side-title">Customer</h3>
              <p className="ticket-side-primary">{DUMMY_TICKET.customerName}</p>
              <p className="ticket-side-secondary">
                {DUMMY_TICKET.customerEmail}
              </p>
            </section>

            <section className="ticket-side-card">
              <h3 className="ticket-side-title">Details</h3>
              <dl className="ticket-side-list">
                <div className="ticket-side-item">
                  <dt>Priority</dt>
                  <dd>{DUMMY_TICKET.priority}</dd>
                </div>
                <div className="ticket-side-item">
                  <dt>Status</dt>
                  <dd>{DUMMY_TICKET.status}</dd>
                </div>
                <div className="ticket-side-item">
                  <dt>Created</dt>
                  <dd>{DUMMY_TICKET.createdAt}</dd>
                </div>
                <div className="ticket-side-item">
                  <dt>Updated</dt>
                  <dd>{DUMMY_TICKET.updatedAt}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
