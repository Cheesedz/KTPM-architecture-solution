const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const multer = require('multer');

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/template/index.html');
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files', 10), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  console.info(`Uploaded file: ${JSON.stringify(req.files)}`)

  res.json({
    message: 'Files uploaded successfully',
    files: req.files
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})