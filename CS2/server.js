const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { sendToQueue } = require("./controller/processStarter");
const { getCachedImage } = require("./config/redis");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 500, 
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

const outputDirectory = path.join(__dirname, "output");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/template/index.html");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.array("files", 10), (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  console.info(`Uploaded file: ${JSON.stringify(req.files)}`);
  req.files.forEach(async (file) => {
    try {
      const metadata = await sharp(file.path).metadata();

      const message = {
        path: file.path,
        metadata,
        originalname: file.originalname,
      };

      const cacheKey = `image:${file.originalname}:${metadata.width}:${metadata.height}`
      console.log('cacheKey', cacheKey)
      const rs = await getCachedImage(cacheKey)
      if (!rs) {
        await sendToQueue("ocr_queue", message);
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
    }
  });

  res.status(200).json({
    message: "Files processed successfully",
    files: req.files,
  });
});

app.get("/status/:filename/:originalname", async (req, res) => {
  const { filename, originalname } = req.params;
  const metadata = await sharp(`uploads/${filename}`).metadata();

  const cacheKey = `image:${originalname}:${metadata.width}:${metadata.height}`
  const rs = await getCachedImage(cacheKey);

  if (rs) {
    return res.json({
      status: "done",
      downloadLink: `/downloads/${JSON.parse(rs).split("/")[2]}`,
    });
  }
  const outputFile = path.join(
    outputDirectory,
    filename.replace(path.extname(filename), ".pdf")
  );

  if (fs.existsSync(outputFile)) {
    return res.json({
      status: "done",
      downloadLink: `/downloads/${filename.replace(
        path.extname(filename),
        ".pdf"
      )}`,
    });
  }

  res.json({ status: "processing" });
});

app.get("/downloads/:filename", (req, res) => {
  const filePath = path.join(outputDirectory, req.params.filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.status(404).send("File not found");
});

const host = process.argv[2] || "localhost";
const port = process.argv[3] || 3000;

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
