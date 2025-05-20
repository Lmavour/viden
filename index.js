const express = require("express");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const mime = require("mime-types");

const app = express();
const port = 3000;

// Aktifkan CORS
app.use(cors());

// Pakai memory storage (tidak disimpan ke file)
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const originalName = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const fileMime = mime.lookup(originalName) || "application/octet-stream";

    const form = new FormData();
    form.append("files[]", fileBuffer, {
      filename: originalName,
      contentType: fileMime
    });

    const response = await axios.post("https://pomf.lain.la/upload.php", form, {
      headers: {
        ...form.getHeaders(),
        origin: "https://pomf.lain.la",
        "user-agent": "Postify/1.0.0"
      }
    });

    const url = response?.data?.files?.[0]?.url;
    if (!url) throw new Error("Upload failed");

    res.json({ url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server aktif di http://localhost:${port}`);
});
