const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve images from /public

// Multer setup (store uploaded file in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET route: return image based on name
app.get("/api/getImage", (req, res) => {
  const name = req.query.name;
  const filePath = path.join(__dirname, "public", `${name}.jpg`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Image not found");
  }
});

// POST route: upload a new image
app.post("/api/upload", upload.single("image"), (req, res) => {
  const name = req.query.name;
  if (!req.file) return res.status(400).send("No file uploaded");
  if (!name) return res.status(400).send("No character name provided");

  const filePath = path.join(__dirname, "public", `${name}.jpg`);

  // Save/overwrite the file
  fs.writeFile(filePath, req.file.buffer, (err) => {
    if (err) return res.status(500).send("Error saving file");
    res.json({ message: `Image for ${name} uploaded successfully!` });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
