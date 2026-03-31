import {
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from './tickets.constants.js';

export default function TicketsToolbar({
  values: { search, status, priority, sortBy, sortOrder },
  filterKeys,
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
          onChange={(e) => setValue(filterKeys.SEARCH, e.target.value)}
        />
      </div>

      {/* TODO: Convert status and priority filters to multi-select controls. */}
      <div className="tickets-filter-group">
        <select
          className="tickets-filter"
          name="status-select"
          id="status-select"
          value={status}
          onChange={(e) => setValue(filterKeys.STATUS, e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="tickets-filter"
          name="priority-select"
          id="priority-select"
          value={priority}
          onChange={(e) => setValue(filterKeys.PRIORITY, e.target.value)}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="tickets-filter"
          name="sort-select"
          id="sort-select"
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => setValue(filterKeys.SORT, e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
