export default function TicketsTable({ isLoading, data }) {
  if (isLoading) {
    return <h2>LOADING...</h2>;
  }

  const { data: tickets } = data;

  return (
    <div className="tickets-list">
      <div className="tickets-list-head">
        <span>Ticket</span>
        <span>Customer</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="tickets-list-row">
          <div className="ticket-cell">
            <p className="ticket-subject">{ticket.subject}</p>
            <p className="ticket-id">{ticket.publicId}</p>
          </div>
          <span>{ticket.customerName}</span>
          <span>{ticket.priority}</span>
          <span>{ticket.status}</span>
          <span>{ticket.updatedAt}</span>
        </div>
      ))}
    </div>
  );
}
