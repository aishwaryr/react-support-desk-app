export default function TicketsTable({ isLoading, isError, tickets }) {
  if (isLoading) {
    return <h2>LOADING...</h2>;
  }

  if (isError) {
    return <h2>Oops, something went wrong.</h2>;
  }

  if (tickets.length === 0) {
    return <h2>No tickets found.</h2>;
  }

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
