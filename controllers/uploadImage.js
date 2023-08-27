const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image provided' });
  }

  const imagePath = req.file.path;
  return res.status(200).json({ imagePath });
});
