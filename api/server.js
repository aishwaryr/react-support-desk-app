const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { seedTickets } = require('./seed-data');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'support-desk.sqlite');
const db = new sqlite3.Database(dbPath);

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'resolved',
  'closed',
];
const VALID_SENDERS = ['customer', 'agent'];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function jsonError(res, status, code, message, details) {
  const payload = { error: { code, message } };
  if (details) payload.error.details = details;
  return res.status(status).json(payload);
}

function parsePositiveInt(value, fallback) {
  if (value == null) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function makeId(prefix) {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${randomPart}`;
}

async function initializeDatabase() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE
    )
  `);

  const existing = await get('SELECT COUNT(*) AS count FROM tickets');
  if (existing.count > 0) return;

  const now = new Date();

  for (
    let ticketIndex = 0;
    ticketIndex < seedTickets.length;
    ticketIndex += 1
  ) {
    const ticket = seedTickets[ticketIndex];
    const createdAt = new Date(
      now.getTime() - (seedTickets.length - ticketIndex) * 3600 * 1000
    ).toISOString();
    const updatedAt = new Date(
      now.getTime() - (seedTickets.length - ticketIndex) * 1800 * 1000
    ).toISOString();
    const ticketId = makeId('t');

    await run(
      `
      INSERT INTO tickets (id, subject, customerName, customerEmail, priority, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ticketId,
        ticket.subject,
        ticket.customerName,
        ticket.customerEmail,
        ticket.priority,
        ticket.status,
        createdAt,
        updatedAt,
      ]
    );

    for (
      let messageIndex = 0;
      messageIndex < ticket.messages.length;
      messageIndex += 1
    ) {
      const seedMessage = ticket.messages[messageIndex];
      const messageTime = new Date(
        new Date(createdAt).getTime() + messageIndex * 600 * 1000
      ).toISOString();
      await run(
        `
        INSERT INTO messages (id, ticketId, sender, message, createdAt)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          makeId('m'),
          ticketId,
          seedMessage.sender,
          seedMessage.message,
          messageTime,
        ]
      );
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok' } });
});

app.get('/api/tickets', async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 20), 100);
    const offset = (page - 1) * limit;

    const filters = [];
    const params = [];

    if (req.query.search) {
      filters.push(
        '(t.subject LIKE ? OR t.customerName LIKE ? OR t.customerEmail LIKE ?)'
      );
      const term = `%${req.query.search.trim()}%`;
      params.push(term, term, term);
    }

    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return jsonError(res, 400, 'VALIDATION_ERROR', 'Invalid status filter');
      }
      filters.push('t.status = ?');
      params.push(req.query.status);
    }

    if (req.query.priority) {
      if (!VALID_PRIORITIES.includes(req.query.priority)) {
        return jsonError(
          res,
          400,
          'VALIDATION_ERROR',
          'Invalid priority filter'
        );
      }
      filters.push('t.priority = ?');
      params.push(req.query.priority);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const sortByRaw = req.query.sortBy || 'updatedAt';
    const sortOrderRaw = (req.query.sortOrder || 'desc').toLowerCase();
    const sortOrder = sortOrderRaw === 'asc' ? 'ASC' : 'DESC';

    let orderBy = 't.updatedAt';
    if (sortByRaw === 'createdAt') orderBy = 't.createdAt';
    if (sortByRaw === 'priority') {
      orderBy = `CASE t.priority
        WHEN 'urgent' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
        ELSE 0 END`;
    }

    const countRow = await get(
      `SELECT COUNT(*) AS total FROM tickets t ${whereClause}`,
      params
    );

    const rows = await all(
      `
      SELECT
        t.id,
        t.subject,
        t.customerName,
        t.customerEmail,
        t.priority,
        t.status,
        t.createdAt,
        t.updatedAt,
        COUNT(m.id) AS messageCount,
        MAX(m.createdAt) AS lastMessageAt
      FROM tickets t
      LEFT JOIN messages m ON m.ticketId = t.id
      ${whereClause}
      GROUP BY t.id
      ORDER BY ${orderBy} ${sortOrder}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      data: rows.map((row) => ({
        ...row,
        messageCount: Number(row.messageCount || 0),
      })),
      meta: {
        page,
        limit,
        total: Number(countRow.total || 0),
        totalPages: Math.max(1, Math.ceil(Number(countRow.total || 0) / limit)),
      },
    });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await get('SELECT * FROM tickets WHERE id = ?', [
      req.params.id,
    ]);
    if (!ticket) {
      return jsonError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const messages = await all(
      'SELECT id, ticketId, sender, message, createdAt FROM messages WHERE ticketId = ? ORDER BY createdAt ASC',
      [req.params.id]
    );

    res.json({
      data: {
        ...ticket,
        messages,
      },
    });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const {
      subject,
      customerName,
      customerEmail,
      priority = 'medium',
      message,
    } = req.body;
    const details = {};

    if (!subject || typeof subject !== 'string' || !subject.trim())
      details.subject = 'Subject is required';
    if (
      !customerName ||
      typeof customerName !== 'string' ||
      !customerName.trim()
    ) {
      details.customerName = 'Customer name is required';
    }
    if (
      !customerEmail ||
      typeof customerEmail !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      details.customerEmail = 'Must be a valid email';
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      details.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      details.message = 'Initial message is required';
    }

    if (Object.keys(details).length > 0) {
      return jsonError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        details
      );
    }

    const ticketId = makeId('t');
    const msgId = makeId('m');
    const now = new Date().toISOString();

    await run(
      `
      INSERT INTO tickets (id, subject, customerName, customerEmail, priority, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'open', ?, ?)
      `,
      [
        ticketId,
        subject.trim(),
        customerName.trim(),
        customerEmail.trim().toLowerCase(),
        priority,
        now,
        now,
      ]
    );

    await run(
      `
      INSERT INTO messages (id, ticketId, sender, message, createdAt)
      VALUES (?, ?, 'customer', ?, ?)
      `,
      [msgId, ticketId, message.trim(), now]
    );

    const created = await get('SELECT * FROM tickets WHERE id = ?', [ticketId]);
    res.status(201).json({ data: created });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { status, priority } = req.body;

    if (status == null && priority == null) {
      return jsonError(res, 400, 'VALIDATION_ERROR', 'Nothing to update');
    }

    if (status != null && !VALID_STATUSES.includes(status)) {
      return jsonError(res, 400, 'VALIDATION_ERROR', 'Invalid status value');
    }

    if (priority != null && !VALID_PRIORITIES.includes(priority)) {
      return jsonError(res, 400, 'VALIDATION_ERROR', 'Invalid priority value');
    }

    const ticket = await get('SELECT * FROM tickets WHERE id = ?', [
      req.params.id,
    ]);
    if (!ticket) {
      return jsonError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const nextStatus = status ?? ticket.status;
    const nextPriority = priority ?? ticket.priority;
    const updatedAt = new Date().toISOString();

    await run(
      'UPDATE tickets SET status = ?, priority = ?, updatedAt = ? WHERE id = ?',
      [nextStatus, nextPriority, updatedAt, req.params.id]
    );

    const updated = await get(
      'SELECT id, status, priority, updatedAt FROM tickets WHERE id = ?',
      [req.params.id]
    );
    res.json({ data: updated });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

app.post('/api/tickets/:id/messages', async (req, res) => {
  try {
    const { sender = 'agent', message } = req.body;

    if (!VALID_SENDERS.includes(sender)) {
      return jsonError(res, 400, 'VALIDATION_ERROR', 'Invalid sender value');
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return jsonError(res, 400, 'VALIDATION_ERROR', 'Message is required');
    }

    const ticket = await get('SELECT * FROM tickets WHERE id = ?', [
      req.params.id,
    ]);
    if (!ticket) {
      return jsonError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const now = new Date().toISOString();
    const msg = {
      id: makeId('m'),
      ticketId: req.params.id,
      sender,
      message: message.trim(),
      createdAt: now,
    };

    await run(
      'INSERT INTO messages (id, ticketId, sender, message, createdAt) VALUES (?, ?, ?, ?, ?)',
      [msg.id, msg.ticketId, msg.sender, msg.message, msg.createdAt]
    );

    await run('UPDATE tickets SET updatedAt = ? WHERE id = ?', [
      now,
      req.params.id,
    ]);

    res.status(201).json({ data: msg });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
      console.log(`SQLite DB: ${dbPath}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
