export const FILTER_KEYS = {
  SEARCH: 'search',
  STATUS: 'status',
  PRIORITY: 'priority',
  SORT: 'sortBy',
};

export const DEFAULT_FILTER_VALUES = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

export const STATUS_OPTIONS = [
  { value: '', label: 'Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_on_customer', label: 'Waiting on Customer' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: '', label: 'Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const SORT_OPTIONS = [
  { value: '', label: 'Sort' },
  { value: 'updatedAt:desc', label: 'Recently Updated' },
  { value: 'updatedAt:asc', label: 'Oldest Updated' },
  { value: 'createdAt:desc', label: 'Newest Created' },
  { value: 'createdAt:asc', label: 'Oldest Created' },
  { value: 'priority:desc', label: 'Priority High-Low' },
  { value: 'priority:asc', label: 'Priority Low-High' },
];
