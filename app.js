// app.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Path to public folder
const publicDir = path.join(__dirname, "public");

// Serve static files (images, built React app, etc.)
app.use(express.static(publicDir));

// Multer: store file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });


// GET /api/getImage?name=tom
// Sends back the image file from /public/<name>.jpg

app.get("/api/getImage", (req, res) => {
  const name = (req.query.name || "").toLowerCase();

  if (!name) {
    return res.status(400).send("Error: name query parameter required");
  }

  const filePath = path.join(publicDir, `${name}.jpg`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Image not found");
  }

  // Prevent caching
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return res.sendFile(filePath);
});


// POST /api/upload?name=tom
// Uploads a new file and saves it as public/<name>.jpg

app.post("/api/upload", upload.single("image"), (req, res) => {
  const name = (req.query.name || "").toLowerCase();

  if (!name) {
    return res.status(400).json({ message: "Error: name query parameter required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Error: image file is required" });
  }

  const filename = `${name}.jpg`;
  const filePath = path.join(publicDir, filename);

  // Write uploaded data to file (overwrite existing)
  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save file", error: err.message });
    }

    return res.json({
      message: `Upload successful. Saved as ${filename}`
    });
  });
});


// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
