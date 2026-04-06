function makePageWindow(page, totalPages) {
  if (totalPages <= 0) return [];
  if (totalPages <= 3) return [...Array(totalPages).keys()].map((i) => i + 1);
  // sliding window cases - totalPages > 3
  if (page <= 2) return [1, 2, 3];
  if (page >= totalPages - 1)
    return [totalPages - 2, totalPages - 1, totalPages];
  return [page - 1, page, page + 1];
}

export default function TicketsPagination({
  page,
  limit,
  total,
  totalPages,
  setPage,
}) {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const pageWindow = makePageWindow(page, totalPages);
  const showFirstAnchor = !pageWindow.includes(1);
  const showLastAnchor = !pageWindow.includes(totalPages);
  const showLeadingEllipsis = showFirstAnchor && pageWindow[0] > 2;
  const showTrailingEllipsis =
    showLastAnchor && pageWindow[pageWindow.length - 1] < totalPages - 1;
  const resultsFrom = page * limit - (limit - 1);
  const resultsTo = page === totalPages ? total : page * limit;

  return (
    <div className="tickets-pagination">
      <p className="tickets-pagination-text">
        {total > 0
          ? `Showing ${resultsFrom} to ${resultsTo} of ${total} results`
          : 'Showing 0 results'}
      </p>
      <div className="tickets-pagination-controls">
        <button
          type="button"
          className="tickets-page-btn"
          aria-label="Previous page"
          disabled={isFirstPage}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {showFirstAnchor && (
          <button
            type="button"
            className="tickets-page-btn tickets-page-btn-number"
            aria-label="Page 1"
            onClick={() => setPage(1)}
          >
            1
          </button>
        )}

        {showLeadingEllipsis && (
          <span className="tickets-pagination-ellipsis" aria-hidden="true">
            ...
          </span>
        )}

        {pageWindow.map((pg) => (
          <button
            type="button"
            className={`tickets-page-btn tickets-page-btn-number ${page === pg ? 'tickets-page-btn-active' : ''}`}
            aria-label="Page 5"
            aria-current="page"
            key={pg}
            onClick={() => setPage(pg)}
          >
            {pg}
          </button>
        ))}

        {showTrailingEllipsis && (
          <span className="tickets-pagination-ellipsis" aria-hidden="true">
            ...
          </span>
        )}

        {showLastAnchor && (
          <button
            type="button"
            className="tickets-page-btn tickets-page-btn-number"
            aria-label="Last page"
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          className="tickets-page-btn"
          aria-label="Next page"
          disabled={isLastPage}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
