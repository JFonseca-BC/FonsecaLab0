const express = require('express');
const path = require('path');
const app = express();

// 3000 is a test port!
const PORT = process.env.PORT || 3000;

// Static paths for serving files
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/lang', express.static(path.join(__dirname, 'lang')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serves the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});