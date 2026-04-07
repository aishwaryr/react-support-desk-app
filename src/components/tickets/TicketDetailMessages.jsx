export default function TicketDetailMessages({ messages }) {
  return (
    <section className="ticket-thread">
      <div className="ticket-thread-head">
        <h3 className="ticket-thread-title">Conversation</h3>
      </div>

      <div className="ticket-thread-list">
        {messages.map((message) => (
          <article key={message.id} className="ticket-message-row">
            <p className="ticket-message-meta">
              <span className="ticket-message-sender">{message.sender}</span>
              <span className="ticket-message-dot">•</span>
              <span>{message.createdAt}</span>
            </p>
            <p className="ticket-message-body">{message.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
