import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../../services/tickets';

import TicketsToolbar from './TicketsToolbar.jsx';
import TicketsTable from './TicketsTable.jsx';
import TicketsPagination from './TicketsPagination';
import { DEFAULT_FILTER_VALUES, FILTER_KEYS } from './tickets.constants.js';

import './tickets.css';

export function TicketsList() {
  const [search, setSearch] = useState(DEFAULT_FILTER_VALUES.search);
  const [status, setStatus] = useState(DEFAULT_FILTER_VALUES.status);
  const [priority, setPriority] = useState(DEFAULT_FILTER_VALUES.priority);
  const [sortBy, setSortBy] = useState(DEFAULT_FILTER_VALUES.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_FILTER_VALUES.sortOrder);
  const [page, setPage] = useState(DEFAULT_FILTER_VALUES.page);
  const [limit, setLimit] = useState(DEFAULT_FILTER_VALUES.limit);

  function setValue(name, value) {
    if (name === FILTER_KEYS.SEARCH) {
      setSearch(value);
      setPage(DEFAULT_FILTER_VALUES.page);
    }
    if (name === FILTER_KEYS.STATUS) {
      setStatus(value);
      setPage(DEFAULT_FILTER_VALUES.page);
    }
    if (name === FILTER_KEYS.PRIORITY) {
      setPriority(value);
      setPage(DEFAULT_FILTER_VALUES.page);
    }
    if (name === FILTER_KEYS.SORT) {
      const [nextSortBy, nextSortOrder] = value.split(':');
      const hasMalformedSortValue = !nextSortBy || !nextSortOrder;

      if (hasMalformedSortValue) {
        setSortBy(DEFAULT_FILTER_VALUES.sortBy);
        setSortOrder(DEFAULT_FILTER_VALUES.sortOrder);
        setPage(DEFAULT_FILTER_VALUES.page);
        return;
      }

      setSortBy(nextSortBy);
      setSortOrder(nextSortOrder);
      setPage(DEFAULT_FILTER_VALUES.page);
    }
  }

  const { isLoading, isError, data } = useQuery({
    // TODO: Tune for fresher ticket data (lower staleTime, refetch on window focus/reconnect, and enable periodic refetch).
    queryKey: [
      'tickets',
      { search, status, priority, sortBy, sortOrder, page, limit },
    ],
    queryFn: () =>
      getTickets({ search, status, priority, sortBy, sortOrder, page, limit }),
    staleTime: 30000,
  });

  const tickets = Array.isArray(data?.data) ? data.data : [];
  const meta = {
    page: Number.isInteger(data?.meta?.page) ? data.meta.page : 1,
    limit: Number.isInteger(data?.meta?.limit)
      ? data.meta.limit
      : DEFAULT_FILTER_VALUES.limit,
    total: Number.isInteger(data?.meta?.total) ? data.meta.total : 0,
    totalPages: Number.isInteger(data?.meta?.totalPages)
      ? data.meta.totalPages
      : 1,
  };

  return (
    <div className="page tickets-page">
      <div className="tickets-section">
        {/*tickets toolbar*/}
        <TicketsToolbar
          values={{ search, status, priority, sortBy, sortOrder }}
          filterKeys={FILTER_KEYS}
          setValue={setValue}
        />
        {/*tickets list*/}
        <TicketsTable
          isLoading={isLoading}
          isError={isError}
          tickets={tickets}
        />
        {/*tickets pagination*/}
        <TicketsPagination {...meta} setPage={setPage} />
      </div>
    </div>
  );
}
