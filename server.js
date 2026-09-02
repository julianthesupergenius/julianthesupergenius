const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const postsFile = path.join(__dirname, 'posts.json');

// Get all posts
app.get('/api/posts', (req, res) => {
    if (!fs.existsSync(postsFile)) {
        return res.json([]);
    }
    const data = fs.readFileSync(postsFile, 'utf8');
    res.json(JSON.parse(data));
});

// Upload a new post
app.post('/api/upload', upload.single('file'), (req, res) => {
    const headline = req.body.headline;
    const date = req.body.date;
    const file = req.file;

    if (!headline || !date || !file) {
        return res.status(400).send('Missing headline, date, or file.');
    }

    let posts = [];
    if (fs.existsSync(postsFile)) {
        posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    }

    const newPost = {
        id: Date.now(),
        headline: headline,
        date: date,
        filePath: 'uploads/' + file.filename
    };

    posts.unshift(newPost); // Add to beginning
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.redirect('/admin.html?success=true');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
