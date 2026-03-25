import './tickets.css';

export function TicketsPage() {
  return (
    <div className="page tickets-page">
      <div className="tickets-section">
        {/*tickets toolbar*/}
        <div className="tickets-toolbar">
          <div className="tickets-search-wrap">
            <input className="tickets-search" placeholder="Search tickets..." />
          </div>
          <div className="tickets-filter-group">
            <select className="tickets-filter" name="" id="">
              <option value="">Status</option>
            </select>

            <select className="tickets-filter" name="" id="">
              <option value="">Priority</option>
            </select>

            <select className="tickets-filter" name="" id="">
              <option value="">Sort</option>
            </select>
          </div>
        </div>

        {/*tickets list*/}
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

        <div className="tickets-pagination">
          <p className="tickets-pagination-text">
            Showing 1 to 6 of 24 results
          </p>
          <div className="tickets-pagination-controls">
            <button
              type="button"
              className="tickets-page-btn"
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              className="tickets-page-btn"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
