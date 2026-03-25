import './tickets.css';

export function TicketsPage() {
  return (
    <div className="page tickets-page">
      <div className="tickets-section">
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

        <div className="tickets-list">{/*list/table comes here*/}</div>
        <div className="tickets-pagination">{/*pagination*/}</div>
      </div>
    </div>
  );
}
