export default function TicketDetailHeader({ ticket }) {
  return (
    <header className="ticket-detail-header">
      <div className="ticket-detail-heading">
        <p className="ticket-detail-public-id">{ticket.publicId}</p>
        <h2 className="ticket-detail-subject">{ticket.subject}</h2>
      </div>

      <div className="ticket-detail-meta-pills">
        <span className="ticket-meta-pill ticket-meta-pill-priority">
          {ticket.priority}
        </span>
        <span className="ticket-meta-pill ticket-meta-pill-status">
          {ticket.status}
        </span>
      </div>
    </header>
  );
}
