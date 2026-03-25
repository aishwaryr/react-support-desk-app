export async function getTickets({
  search = '',
  status = '',
  priority = '',
  sortBy = 'updatedAt',
  sortOrder = 'desc',
  page = 1,
  limit = 20,
} = {}) {
  const query = {
    search: search.trim() || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sortBy,
    sortOrder,
    page: String(page),
    limit: String(limit),
  };

  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value != null && value !== '')
  );

  const response = await fetch(`/api/tickets?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }

  return response.json();
}
