// server.js 
// Week 06 server: in-memory posts, image upload (Multer), delete by id (JSON)

const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();

// ---- Static + parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve uploaded files
app.use(express.urlencoded({ extended: true }));  // form-encoded
app.use(express.json());                           // JSON bodies

// ---- Multer (store uploaded images in /uploads)
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename:    (_, file, cb) => {
      const safe = file.originalname.replace(/\s+/g, '_');
      cb(null, Date.now() + '-' + safe);
    }
  })
});

// ---- In-memory data (resets on restart)
let data = [];
let postNum = 0;

// ---- Routes

// Home (serves LSPA HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Feed JSON (script.js loads this)
app.get('/all-messages', (req, res) => {
  res.json({ messages: data });
});

// Submit a new post (supports offender/caption + optional image)
app.post('/submit', upload.single('image'), (req, res) => {
  const b = req.body || {}; // safety

  const userRaw = (b.username ?? b.offender ?? '').toString();
  const msgRaw  = (b.message  ?? b.caption  ?? '').toString();

  const user    = userRaw.trim();
  const message = msgRaw.trim();

  if (!message) return res.status(400).send('Message/Caption is required');

  const imgPath = req.file ? `/uploads/${req.file.filename}` : '';
  const time    = new Date().toLocaleString();

  const newPost = {
    // Prof/Week-06 style
    username: user,
    message,
    date: time,
    postNumber: postNum,

    // Also keep keys user uses
    offender: user,
    caption: message,
    media: imgPath ? { image: imgPath } : undefined
  };

  postNum++;
  data.push(newPost);

  // Redirect back to homepage
  res.redirect('/');
});

// Delete by id — return JSON (so fetch DELETE sees 200 OK)
app.delete('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = data.findIndex(p => p.postNumber == id);

  if (idx === -1) {
    console.log('DELETE miss for id', id);
    return res.status(404).json({ ok: false, error: 'not found' });
  }

  data.splice(idx, 1);
  console.log('Deleted post id', id);
  return res.json({ ok: true });
});

// Listen on all interfaces so public IP works
app.listen(5001, '0.0.0.0', () => {
  console.log('server is running on 0.0.0.0:5001');
});
