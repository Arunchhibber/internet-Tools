import { useState } from "react";

function App() {
  const [searchName, setSearchName] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);

  const handleSearch = () => {
    if (!searchName.trim()) return alert("Enter a name");
    setImageURL(`/api/getImage?name=${searchName}&t=${Date.now()}`); // cache-busting
  };

  const handleUpload = async () => {
    if (!uploadName.trim() || !uploadFile) return alert("Enter name & select file");

    const formData = new FormData();
    formData.append("image", uploadFile);

    const res = await fetch(`/api/upload?name=${uploadName}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);

    // Immediately show the new image
    setImageURL(`/api/getImage?name=${uploadName}&t=${Date.now()}`);
  };

  const boxStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  };

  const inputStyle = { padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #ccc" };
  const buttonStyle = { padding: "12px 20px", background: "#0071e3", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px" };
  const imgStyle = { marginTop: "20px", maxWidth: "100%", borderRadius: "15px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial, sans-serif", background: "#f8f3e8", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
      <h1>Image Search & Upload</h1>

      <div style={boxStyle}>
        <h2>Search Image</h2>
        <input type="text" placeholder="Enter name (ex: tom)" value={searchName} onChange={(e) => setSearchName(e.target.value)} style={inputStyle} />
        <button onClick={handleSearch} style={buttonStyle}>Search</button>
        {imageURL && <img src={imageURL} alt="result" style={imgStyle} />}
      </div>

      <div style={boxStyle}>
        <h2>Upload Image</h2>
        <input type="text" placeholder="Enter name (ex: tom)" value={uploadName} onChange={(e) => setUploadName(e.target.value)} style={inputStyle} />
        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} style={{ fontSize: "16px", marginTop: "10px" }} />
        <button onClick={handleUpload} style={buttonStyle}>Upload</button>
      </div>
    </div>
  );
}

export default App;
