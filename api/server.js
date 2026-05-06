/**
 * Backend API Documentation
 *
 * GET /api/health
 * - Health check endpoint.
 *
 * GET /api/tickets
 * - Returns paginated ticket list.
 * - Supports query params: search, status, priority, sortBy, sortOrder, page, limit.
 *
 * GET /api/tickets/:id
 * - Returns ticket details including attachments.
 *
 * POST /api/tickets
 * - Creates a ticket with multipart/form-data:
 *   subject, customerName, customerEmail, description,
 *   optional priority, optional categoryId, optional attachments[] (images only).
 *
 * PATCH /api/tickets/:id
 * - Updates ticket status and/or priority.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const { seedTickets } = require('./seed-data');

const app = express();
const port = 3000;

const dataDir = path.join(__dirname, 'data');
const uploadsRootDir = path.join(__dirname, 'uploads');
const ticketUploadsDir = path.join(uploadsRootDir, 'tickets');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(ticketUploadsDir)) {
  fs.mkdirSync(ticketUploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsRootDir));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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
const DEFAULT_CATEGORIES = [
  'Billing',
  'Technical',
  'Account',
  'Feature Request',
  'Other',
];
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ticketUploadsDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const sanitizedExt = ext || '.bin';
      cb(null, `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${sanitizedExt}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      const err = new Error('Only png, jpeg, and webp image uploads are allowed');
      err.code = 'INVALID_FILE_TYPE';
      return cb(err);
    }
    return cb(null, true);
  },
  limits: {
    fileSize: MAX_ATTACHMENT_SIZE,
    files: 10,
  },
});

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

function formatPublicId(number) {
  return `T-${String(number).padStart(4, '0')}`;
}

function parsePublicIdNumber(publicId) {
  if (typeof publicId !== 'string') return null;
  const match = /^T-(\d+)$/.exec(publicId);
  if (!match) return null;

  const parsed = Number.parseInt(match[1], 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeAttachmentRecord(file, now) {
  return {
    id: makeId('a'),
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    path: `/uploads/tickets/${file.filename}`,
    createdAt: now,
  };
}

function removeUploadedFiles(files = []) {
  for (const file of files) {
    try {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Failed to remove uploaded file:', file?.path, error);
    }
  }
}

async function getNextPublicId() {
  const existing = await all(
    "SELECT publicId FROM tickets WHERE publicId IS NOT NULL AND publicId != ''"
  );

  let maxNumber = 0;
  for (const row of existing) {
    const parsed = parsePublicIdNumber(row.publicId);
    if (parsed && parsed > maxNumber) {
      maxNumber = parsed;
    }
  }

  return formatPublicId(maxNumber + 1);
}

async function ensureTicketPublicIds() {
  const columns = await all('PRAGMA table_info(tickets)');
  const hasPublicIdColumn = columns.some(
    (column) => column.name === 'publicId'
  );

  if (!hasPublicIdColumn) {
    await run('ALTER TABLE tickets ADD COLUMN publicId TEXT');
  }

  const unassignedTickets = await all(
    "SELECT id FROM tickets WHERE publicId IS NULL OR publicId = '' ORDER BY datetime(createdAt) ASC, id ASC"
  );

  if (unassignedTickets.length > 0) {
    let nextNumber = 1;
    const existing = await all(
      "SELECT publicId FROM tickets WHERE publicId IS NOT NULL AND publicId != ''"
    );

    for (const row of existing) {
      const parsed = parsePublicIdNumber(row.publicId);
      if (parsed && parsed >= nextNumber) {
        nextNumber = parsed + 1;
      }
    }

    for (const ticket of unassignedTickets) {
      await run('UPDATE tickets SET publicId = ? WHERE id = ?', [
        formatPublicId(nextNumber),
        ticket.id,
      ]);
      nextNumber += 1;
    }
  }

  await run(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_publicId ON tickets(publicId)'
  );
}

async function ensureTicketColumns() {
  const columns = await all('PRAGMA table_info(tickets)');
  const hasDescription = columns.some((column) => column.name === 'description');
  const hasCategoryId = columns.some((column) => column.name === 'categoryId');

  if (!hasDescription) {
    await run('ALTER TABLE tickets ADD COLUMN description TEXT');
  }

  if (!hasCategoryId) {
    await run('ALTER TABLE tickets ADD COLUMN categoryId INTEGER');
  }

  await run(
    "UPDATE tickets SET description = COALESCE(NULLIF(TRIM(description), ''), subject)"
  );
}

async function ensureCategoriesTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS ticket_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    )
  `);

  const now = new Date().toISOString();
  for (const categoryName of DEFAULT_CATEGORIES) {
    await run(
      `
      INSERT OR IGNORE INTO ticket_categories (name, createdAt)
      VALUES (?, ?)
      `,
      [categoryName, now]
    );
  }
}

async function ensureAttachmentsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS ticket_attachments (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL,
      originalName TEXT NOT NULL,
      fileName TEXT NOT NULL,
      mimeType TEXT NOT NULL,
      size INTEGER NOT NULL,
      path TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (ticketId) REFERENCES tickets(id) ON DELETE CASCADE
    )
  `);

  await run(
    'CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticketId ON ticket_attachments(ticketId)'
  );
}

async function getCategoryIdByName(name) {
  if (!name) return null;
  const row = await get(
    'SELECT id FROM ticket_categories WHERE LOWER(name) = LOWER(?) LIMIT 1',
    [name]
  );
  return row?.id ?? null;
}

async function getAttachmentsByTicketIds(ticketIds) {
  if (!Array.isArray(ticketIds) || ticketIds.length === 0) return new Map();

  const placeholders = ticketIds.map(() => '?').join(', ');
  const rows = await all(
    `
    SELECT id, ticketId, originalName, fileName, mimeType, size, path, createdAt
    FROM ticket_attachments
    WHERE ticketId IN (${placeholders})
    ORDER BY datetime(createdAt) ASC
    `,
    ticketIds
  );

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.ticketId)) {
      map.set(row.ticketId, []);
    }
    map.get(row.ticketId).push(row);
  }

  return map;
}

async function initializeDatabase() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      publicId TEXT UNIQUE,
      subject TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      categoryId INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES ticket_categories(id)
    )
  `);

  await ensureTicketColumns();
  await ensureTicketPublicIds();
  await ensureCategoriesTable();
  await ensureAttachmentsTable();

  const existing = await get('SELECT COUNT(*) AS count FROM tickets');
  if (existing.count > 0) return;

  const now = new Date();

  for (
    let ticketIndex = 0;
    ticketIndex < seedTickets.length;
    ticketIndex += 1
  ) {
    const ticket = seedTickets[ticketIndex];
    const publicId = formatPublicId(ticketIndex + 1);
    const createdAt = new Date(
      now.getTime() - (seedTickets.length - ticketIndex) * 3600 * 1000
    ).toISOString();
    const updatedAt = new Date(
      now.getTime() - (seedTickets.length - ticketIndex) * 1800 * 1000
    ).toISOString();
    const ticketId = makeId('t');
    const categoryId = await getCategoryIdByName(ticket.categoryName);

    await run(
      `
      INSERT INTO tickets (id, publicId, subject, customerName, customerEmail, priority, status, description, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ticketId,
        publicId,
        ticket.subject,
        ticket.customerName,
        ticket.customerEmail,
        ticket.priority,
        ticket.status,
        ticket.description,
        categoryId,
        createdAt,
        updatedAt,
      ]
    );
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
        '(t.subject LIKE ? OR t.customerName LIKE ? OR t.customerEmail LIKE ? OR t.publicId LIKE ? OR t.description LIKE ?)'
      );
      const term = `%${req.query.search.trim()}%`;
      params.push(term, term, term, term, term);
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
        t.publicId,
        t.subject,
        t.customerName,
        t.customerEmail,
        t.priority,
        t.status,
        t.description,
        t.categoryId,
        c.name AS categoryName,
        t.createdAt,
        t.updatedAt
      FROM tickets t
      LEFT JOIN ticket_categories c ON c.id = t.categoryId
      ${whereClause}
      ORDER BY ${orderBy} ${sortOrder}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const ticketIds = rows.map((row) => row.id);
    const attachmentsByTicketId = await getAttachmentsByTicketIds(ticketIds);

    res.json({
      data: rows.map((row) => ({
        ...row,
        attachments: attachmentsByTicketId.get(row.id) || [],
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
    const ticket = await get(
      `
      SELECT
        t.id,
        t.publicId,
        t.subject,
        t.customerName,
        t.customerEmail,
        t.priority,
        t.status,
        t.description,
        t.categoryId,
        c.name AS categoryName,
        t.createdAt,
        t.updatedAt
      FROM tickets t
      LEFT JOIN ticket_categories c ON c.id = t.categoryId
      WHERE t.id = ?
      `,
      [req.params.id]
    );

    if (!ticket) {
      return jsonError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const attachments = await all(
      `
      SELECT id, ticketId, originalName, fileName, mimeType, size, path, createdAt
      FROM ticket_attachments
      WHERE ticketId = ?
      ORDER BY datetime(createdAt) ASC
      `,
      [req.params.id]
    );

    res.json({
      data: {
        ...ticket,
        attachments,
      },
    });
  } catch (error) {
    console.error(error);
    jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  }
});

app.post('/api/tickets', (req, res, next) => {
  upload.array('attachments', 10)(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        return jsonError(
          res,
          400,
          'VALIDATION_ERROR',
          'Each attachment must be 5MB or smaller'
        );
      }

      if (error?.code === 'INVALID_FILE_TYPE') {
        return jsonError(
          res,
          400,
          'VALIDATION_ERROR',
          'Only image/png, image/jpeg, and image/webp files are allowed'
        );
      }

      return jsonError(res, 400, 'VALIDATION_ERROR', 'Invalid upload payload');
    }

    return next();
  });
});

app.post('/api/tickets', async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  try {
    const subject = req.body.subject;
    const customerName = req.body.customerName;
    const customerEmail = req.body.customerEmail;
    const priority = req.body.priority || 'medium';
    const categoryIdRaw = req.body.categoryId;
    const description = req.body.description || req.body.message;

    const details = {};

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      details.subject = 'Subject is required';
    }

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

    if (!description || typeof description !== 'string' || !description.trim()) {
      details.description = 'Description is required';
    }

    let categoryId = null;
    if (categoryIdRaw != null && String(categoryIdRaw).trim() !== '') {
      categoryId = Number.parseInt(String(categoryIdRaw), 10);
      if (Number.isNaN(categoryId) || categoryId <= 0) {
        details.categoryId = 'Category ID must be a positive integer';
      } else {
        const existingCategory = await get(
          'SELECT id FROM ticket_categories WHERE id = ?',
          [categoryId]
        );
        if (!existingCategory) {
          details.categoryId = 'Category ID does not exist';
        }
      }
    }

    if (Object.keys(details).length > 0) {
      removeUploadedFiles(files);
      return jsonError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        details
      );
    }

    const ticketId = makeId('t');
    const publicId = await getNextPublicId();
    const now = new Date().toISOString();

    await run(
      `
      INSERT INTO tickets (id, publicId, subject, customerName, customerEmail, priority, status, description, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?)
      `,
      [
        ticketId,
        publicId,
        subject.trim(),
        customerName.trim(),
        customerEmail.trim().toLowerCase(),
        priority,
        description.trim(),
        categoryId,
        now,
        now,
      ]
    );

    for (const file of files) {
      const attachment = normalizeAttachmentRecord(file, now);
      await run(
        `
        INSERT INTO ticket_attachments (id, ticketId, originalName, fileName, mimeType, size, path, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          attachment.id,
          ticketId,
          attachment.originalName,
          attachment.fileName,
          attachment.mimeType,
          attachment.size,
          attachment.path,
          attachment.createdAt,
        ]
      );
    }

    const created = await get(
      `
      SELECT
        t.id,
        t.publicId,
        t.subject,
        t.customerName,
        t.customerEmail,
        t.priority,
        t.status,
        t.description,
        t.categoryId,
        c.name AS categoryName,
        t.createdAt,
        t.updatedAt
      FROM tickets t
      LEFT JOIN ticket_categories c ON c.id = t.categoryId
      WHERE t.id = ?
      `,
      [ticketId]
    );

    const attachments = await all(
      `
      SELECT id, ticketId, originalName, fileName, mimeType, size, path, createdAt
      FROM ticket_attachments
      WHERE ticketId = ?
      ORDER BY datetime(createdAt) ASC
      `,
      [ticketId]
    );

    return res.status(201).json({
      data: {
        ...created,
        attachments,
      },
    });
  } catch (error) {
    console.error(error);
    removeUploadedFiles(files);
    return jsonError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
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

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
      console.log(`SQLite DB: ${dbPath}`);
      console.log(`Uploads served from: ${uploadsRootDir}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
