export async function getTickets() {
  const response = await fetch(`/api/tickets`);
  const data = await response.json();
  return data;
}
