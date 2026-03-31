const seedTicketsSmall = [
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
    const status = statuses[(i - 1) % statuses.length];

    tickets.push({
      subject: `${subject} (#${i})`,
      customerName,
      customerEmail,
      priority,
      status,
      messages: [
        {
          sender: 'customer',
          message: `Hi support, issue #${i} started this morning and blocks my workflow.`,
        },
        {
          sender: 'agent',
          message:
            'Thanks for reporting this. We are reviewing and will follow up soon.',
        },
      ],
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
