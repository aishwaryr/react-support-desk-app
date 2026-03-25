export default function TicketsPagination() {
  return (
    <div className="tickets-pagination">
      <p className="tickets-pagination-text">Showing 1 to 6 of 24 results</p>
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
  );
}
