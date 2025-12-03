import { useState } from "react";
import "./App.css";

function App() {
  const [searchName, setSearchName] = useState("");
  const [imageURL, setImageURL] = useState(null);

  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  // SEARCH IMAGE
  const handleSearch = () => {
    if (!searchName.trim()) {
      alert("Enter a name");
      return;
    }

    setImageURL(`/api/getImage?name=${searchName}`);
  };

  // UPLOAD FILE
  const handleUpload = async () => {
    if (!uploadName.trim()) {
      alert("Enter the character name");
      return;
    }
    if (!uploadFile) {
      alert("Select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadFile);

    const res = await fetch(`/api/upload?name=${uploadName}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="App">
      <h1>Image Search & Upload</h1>

      {/* SEARCH */}
      <div className="section">
        <h2>Search Image</h2>
        <input
          type="text"
          placeholder="Enter name (ex: tom)"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {imageURL && (
          <div className="image-box">
            <img src={imageURL} alt="result" />
          </div>
        )}
      </div>

      {/* UPLOAD */}
      <div className="section">
        <h2>Upload New Image</h2>
        <input
          type="text"
          placeholder="Enter name (ex: tom)"
          value={uploadName}
          onChange={(e) => setUploadName(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setUploadFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default App;
