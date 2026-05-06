const seedTicketsSmall = [
  {
    subject: 'Cannot reset password',
    customerName: 'Sam Lee',
    customerEmail: 'sam.lee@example.com',
    priority: 'high',
    status: 'open',
    categoryName: 'Account',
    description: 'I am not receiving the password reset email.',
  },
  {
    subject: 'Billing issue: charged twice',
    customerName: 'Ava Kim',
    customerEmail: 'ava.kim@example.com',
    priority: 'urgent',
    status: 'in_progress',
    categoryName: 'Billing',
    description: 'I got charged twice for my monthly subscription.',
  },
  {
    subject: 'Feature request: export CSV',
    customerName: 'Jordan Patel',
    customerEmail: 'jordan.patel@example.com',
    priority: 'low',
    status: 'waiting_on_customer',
    categoryName: 'Feature Request',
    description: 'Could you add CSV export for ticket list?',
  },
  {
    subject: 'App is slow on dashboard',
    customerName: 'Nina Rossi',
    customerEmail: 'nina.rossi@example.com',
    priority: 'medium',
    status: 'open',
    categoryName: 'Technical',
    description: 'Dashboard takes 8-10 seconds to load.',
  },
  {
    subject: 'Need invoice for last month',
    customerName: 'Miguel Santos',
    customerEmail: 'miguel.santos@example.com',
    priority: 'medium',
    status: 'resolved',
    categoryName: 'Billing',
    description: 'Please send me invoice for February.',
  },
  {
    subject: 'Login fails with SSO',
    customerName: 'Priya Verma',
    customerEmail: 'priya.verma@example.com',
    priority: 'high',
    status: 'closed',
    categoryName: 'Account',
    description: 'SSO login returns unauthorized.',
  },
];

function createLargeSeedTickets(total = 72) {
  const subjects = [
    'Cannot upload file attachments',
    'Invoice PDF missing line items',
    'Mobile app crashes on startup',
    'Two-factor code never arrives',
    'Webhook retry keeps failing',
    'Need account ownership transfer',
    'Dashboard chart data looks incorrect',
    'Unable to invite teammates',
    'Requesting plan downgrade details',
    'Bulk actions timeout on large sets',
    'Export job is stuck in processing',
    'Notification emails delayed',
  ];

  const firstNames = [
    'Alex',
    'Taylor',
    'Jordan',
    'Casey',
    'Riley',
    'Morgan',
    'Jamie',
    'Cameron',
    'Avery',
    'Parker',
    'Quinn',
    'Drew',
  ];

  const lastNames = [
    'Nguyen',
    'Patel',
    'Garcia',
    'Kim',
    'Johnson',
    'Singh',
    'Brown',
    'Lopez',
    'Davis',
    'Clark',
    'Miller',
    'Shah',
  ];

  const priorities = ['low', 'medium', 'high', 'urgent'];
  const categories = [
    'Billing',
    'Technical',
    'Account',
    'Feature Request',
    'Other',
  ];
  const statuses = [
    'open',
    'in_progress',
    'waiting_on_customer',
    'resolved',
    'closed',
  ];

  const tickets = [];

  for (let i = 1; i <= total; i += 1) {
    const subject = subjects[(i - 1) % subjects.length];
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[Math.floor((i - 1) / 2) % lastNames.length];
    const customerName = `${firstName} ${lastName}`;
    const customerEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}+${i}@example.com`;
    const priority = priorities[(i - 1) % priorities.length];
    const categoryName = categories[(i - 1) % categories.length];
    const status = statuses[(i - 1) % statuses.length];

    tickets.push({
      subject: `${subject} (#${i})`,
      customerName,
      customerEmail,
      priority,
      categoryName,
      status,
      description: `Hi support, issue #${i} started this morning and blocks my workflow.`,
    });
  }

  return tickets;
}

const seedTicketsLarge = createLargeSeedTickets(72);

// Active seed set used by server bootstrap.
// Switch to seedTicketsSmall when you want lightweight local data.
const seedTickets = seedTicketsLarge;

module.exports = {
  seedTickets,
  seedTicketsSmall,
  seedTicketsLarge,
};
