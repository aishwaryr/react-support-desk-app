export default function TicketsToolbar({
  values: { search, status, priority, sortBy, sortOrder },
  setValue,
}) {
  // TODO: Debounce search updates before setValue to reduce API calls per keystroke.
  return (
    <div className="tickets-toolbar">
      <div className="tickets-search-wrap">
        <input
          className="tickets-search"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setValue('search', e.target.value)}
        />
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
  );
}
