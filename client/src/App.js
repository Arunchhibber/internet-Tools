import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [queryName, setQueryName] = useState("tom");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  const fetchImage = (name) => {
    if (!name) return setImageSrc(null);
    const ts = Date.now();
    setImageSrc(`/api/getImage?name=${name}&_=${ts}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setStatus("");
    fetchImage(queryName.toLowerCase());
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Select a file first");
    if (!queryName) return setStatus("Enter a name");

    const form = new FormData();
    form.append("image", file);

    try {
      const resp = await axios.post(
        `/api/upload?name=${queryName.toLowerCase()}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setStatus(resp.data.message);
      fetchImage(queryName.toLowerCase());
    } catch (err) {
      setStatus("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Image Manager</h1>

      <form onSubmit={handleSearch}>
        <input
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {imageSrc ? (
          <img src={imageSrc} alt="character" width="300" />
        ) : (
          <p>No image yet</p>
        )}
      </div>

      <h2>Upload New Image</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload}>Upload</button>

      <p>Status: {status}</p>
    </div>
  );
}
