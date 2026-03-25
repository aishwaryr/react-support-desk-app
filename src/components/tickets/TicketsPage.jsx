import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../../services/tickets';

import TicketsToolbar from './TicketsToolbar.jsx';
import TicketsTable from './TicketsTable.jsx';
import TicketsPagination from './TicketsPagination';

import './tickets.css';

export function TicketsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { isLoading, data } = useQuery({
    queryKey: [
      'tickets',
      { search, status, priority, sortBy, sortOrder, page, limit },
    ],
    queryFn: () =>
      getTickets({ search, status, priority, sortBy, sortOrder, page, limit }),
    staleTime: 30000,
  });

  return (
    <div className="page tickets-page">
      <div className="tickets-section">
        {/*tickets toolbar*/}
        <TicketsToolbar />
        {/*tickets list*/}
        <TicketsTable />
        {/*tickets pagination*/}
        <TicketsPagination />
      </div>
    </div>
  );
}
