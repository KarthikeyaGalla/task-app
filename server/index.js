const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

console.log('--- SERVER RESTARTING (FINAL VERSION) ---');
console.log('Spreadsheet ID:', process.env.SPREADSHEET_ID);

// 1. Auth Setup using Google Auth Library (Works with google-spreadsheet v4/v5)
// 1. Auth Setup: Prefer Context Env Vars (Render), fallback to local file (Dev)
let googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL;
let googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!googleClientEmail || !googlePrivateKey) {
  try {
    const serviceAccount = require('./service-account.json');
    googleClientEmail = serviceAccount.client_email;
    googlePrivateKey = serviceAccount.private_key;
  } catch (err) {
    console.warn('Local service-account.json not found. Ensure Env Vars are set.');
  }
}

if (!googleClientEmail || !googlePrivateKey) {
  throw new Error('Missing Google Spreadsheet Credentials (Email or Private Key)');
}

// Fix for Render/Vercel/etc. where private key newlines might be escaped
if (googlePrivateKey) {
  googlePrivateKey = googlePrivateKey.replace(/\\n/g, '\n');
}

const serviceAccountAuth = new JWT({
  email: googleClientEmail,
  key: googlePrivateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);

async function initDoc() {
  try {
    await doc.loadInfo();
    console.log(`Connected to Sheet: ${doc.title}`);
  } catch (err) {
    console.error('Failed to connect to Doc:', err);
  }
}
initDoc();

// Helper: Get Sheet
async function getSheet() {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  // Ensure headers exist
  // We try to read them. If they are missing or empty, we set them.
  try {
    await sheet.loadHeaderRow();
    if (sheet.headerValues.length === 0) throw new Error('No Headers');
  } catch (e) {
    console.log('Headers missing/empty. Setting defaults...');
    await sheet.setHeaderRow(['TaskId', 'TaskName', 'Description', 'Domain', 'Mode', 'Status', 'CreatedDate', 'DueDate']);
  }
  return sheet;
}

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const tasks = rows.map(row => ({
      TaskId: row.get('TaskId'),
      TaskName: row.get('TaskName'),
      Description: row.get('Description'),
      Domain: row.get('Domain'),
      Mode: row.get('Mode'),
      Status: row.get('Status'),
      CreatedDate: row.get('CreatedDate'),
      DueDate: row.get('DueDate'),
    }));
    res.json(tasks);
  } catch (error) {
    console.error('GET Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  console.log('POST Body:', req.body);
  try {
    const sheet = await getSheet();
    const newTask = {
      TaskId: Date.now().toString(),
      TaskName: req.body.TaskName,
      Description: req.body.Description || '',
      Domain: req.body.Domain,
      Mode: req.body.Mode,
      Status: 'Not Started',
      CreatedDate: new Date().toISOString(),
      DueDate: req.body.DueDate || new Date().toISOString()
    };

    // google-spreadsheet v4/v5 addRow simply takes the object
    await sheet.addRow(newTask);
    console.log('Row Added!');
    res.status(201).json(newTask);
  } catch (error) {
    console.error('POST Error details:', error);
    // Return the full error to the frontend
    res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const taskRow = rows.find(r => r.get('TaskId') === req.params.id);
    if (!taskRow) return res.status(404).json({ error: 'Task not found' });

    if (req.body.Status) taskRow.assign({ Status: req.body.Status });
    if (req.body.TaskName) taskRow.assign({ TaskName: req.body.TaskName });
    if (req.body.Description) taskRow.assign({ Description: req.body.Description });
    if (req.body.Domain) taskRow.assign({ Domain: req.body.Domain });
    if (req.body.Mode) taskRow.assign({ Mode: req.body.Mode });
    if (req.body.DueDate) taskRow.assign({ DueDate: req.body.DueDate });

    await taskRow.save();
    res.json({ message: 'Updated' });
  } catch (error) {
    console.error('PUT Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    const taskRow = rows.find(r => r.get('TaskId') === req.params.id);
    if (!taskRow) return res.status(404).json({ error: 'Task not found' });

    await taskRow.delete();
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Keep-alive to prevent process exit
setInterval(() => {
  // This keeps the event loop active
}, 10000);

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
