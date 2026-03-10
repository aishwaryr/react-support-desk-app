const seedTickets = [
  {
    subject: 'Cannot reset password',
    customerName: 'Sam Lee',
    customerEmail: 'sam.lee@example.com',
    priority: 'high',
    status: 'open',
    messages: [
      {
        sender: 'customer',
        message: 'I am not receiving the password reset email.',
      },
      {
        sender: 'agent',
        message: 'Thanks Sam. Can you check your spam folder once?',
      },
    ],
  },
  {
    subject: 'Billing issue: charged twice',
    customerName: 'Ava Kim',
    customerEmail: 'ava.kim@example.com',
    priority: 'urgent',
    status: 'in_progress',
    messages: [
      {
        sender: 'customer',
        message: 'I got charged twice for my monthly subscription.',
      },
      {
        sender: 'agent',
        message: 'Sorry about that. We are verifying the invoice now.',
      },
    ],
  },
  {
    subject: 'Feature request: export CSV',
    customerName: 'Jordan Patel',
    customerEmail: 'jordan.patel@example.com',
    priority: 'low',
    status: 'waiting_on_customer',
    messages: [
      {
        sender: 'customer',
        message: 'Could you add CSV export for ticket list?',
      },
    ],
  },
  {
    subject: 'App is slow on dashboard',
    customerName: 'Nina Rossi',
    customerEmail: 'nina.rossi@example.com',
    priority: 'medium',
    status: 'open',
    messages: [
      {
        sender: 'customer',
        message: 'Dashboard takes 8-10 seconds to load.',
      },
    ],
  },
  {
    subject: 'Need invoice for last month',
    customerName: 'Miguel Santos',
    customerEmail: 'miguel.santos@example.com',
    priority: 'medium',
    status: 'resolved',
    messages: [
      { sender: 'customer', message: 'Please send me invoice for February.' },
      {
        sender: 'agent',
        message: 'Invoice sent to your email. Please confirm.',
      },
    ],
  },
  {
    subject: 'Login fails with SSO',
    customerName: 'Priya Verma',
    customerEmail: 'priya.verma@example.com',
    priority: 'high',
    status: 'closed',
    messages: [
      { sender: 'customer', message: 'SSO login returns unauthorized.' },
      {
        sender: 'agent',
        message: 'This has been fixed. Please retry and confirm.',
      },
    ],
  },
];

module.exports = {
  seedTickets,
};
