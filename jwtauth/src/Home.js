import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  

export default function Home() {
  const [videos, setVideos] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",  
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f2f2f2",
        marginRight:"30px"
      }}
    >
      
      <nav style={{ marginBottom: "20px" }}>  
        <Link to="/logout">Logout</Link>  
      </nav>

  
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          width: "600px",
          textAlign: "center",
          border: "2px solid green",
          marginTop: "150px",
        }}
      >
        <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Employees List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ borderBottom: "2px solid #ddd", padding: "8px" }}>Gmail</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id}>
                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{video.name}</td>
                <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{video.gmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div style={{ marginTop: "20px" }}>
        <Link 
          to="/logout" 
          style={{
            padding: "10px 20px", 
            backgroundColor: "red", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "5px", 
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
