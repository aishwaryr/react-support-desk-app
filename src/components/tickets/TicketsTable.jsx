export default function TicketsTable() {
  return (
    <div className="tickets-list">
      <div className="tickets-list-head">
        <span>Ticket</span>
        <span>Customer</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Updated</span>
      </div>

      <div className="tickets-list-row">
        <div className="ticket-cell">
          <p className="ticket-subject">Unable to reset password</p>
          <p className="ticket-id">T-1024</p>
        </div>
        <span>Alice Benoit</span>
        <span>High</span>
        <span>Open</span>
        <span>10 mins ago</span>
      </div>
    </div>
  );
}
