const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;
const HOST = '192.168.0.175'; // Your local IP address
const express = require('express');
const app = express();

// Use PORT environment variable provided by Vercel
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Set up EJS view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Multer storage config
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Home page: show upload form
app.get('/', (req, res) => {
  res.render('index', { qr: null });
});

// Handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.send("No file uploaded.");

  const filePath = `/uploads/${req.file.filename}`;
  const url = `${req.protocol}://${req.get('host')}${filePath}`;
  const qr = await QRCode.toDataURL(url);

  res.render('index', { qr });
});

// Serve uploaded files
app.get('/uploads/:filename', (req, res) => {
  const file = path.join(__dirname, 'public/uploads', req.params.filename);
  res.sendFile(file);
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
