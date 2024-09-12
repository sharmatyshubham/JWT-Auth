const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://localhost:27017";
const jwtSecret = "your_jwt_secret_key"; 





app.post("/api/videos", async (req, res) => {
  const { name, gmail, password } = req.body;

  if (!name || !gmail || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");

    
    const existingUser = await db.collection("videos").findOne({ gmail });
    if (existingUser) {
      client.close();
      return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("videos").insertOne({ name, gmail, password: hashedPassword });
    
    res.status(201).json({ message: "User registered successfully", result });
    client.close();
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});


app.post("/api/login", async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ message: "Gmail and password are required" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");
    const user = await db.collection("videos").findOne({ gmail });

    if (!user) {
      client.close();
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      client.close();
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    
    const token = jwt.sign({ id: user._id, gmail: user.gmail }, jwtSecret, { expiresIn: "1h" });

    
    await db.collection("login").insertOne({ gmail, password: user.password, token });
    
    client.close();
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});


app.delete("/api/logout", async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ message: "Gmail and password are required" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");

    
    const user = await db.collection("login").findOne({ gmail });
    if (!user) {
      client.close();
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      client.close();
      return res.status(401).json({ message: "Invalid gmail or password" });
    }

    
    await db.collection("login").deleteOne({ gmail });

    client.close();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});


app.post("/api/send-reset-link", async (req, res) => {
  const { gmail } = req.body;

  if (!gmail) {
    return res.status(400).json({ message: "Gmail is required" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");
    const user = await db.collection("videos").findOne({ gmail });

    if (!user) {
      client.close();
      return res.status(404).json({ message: "User not found" });
    }

    
    const resetToken = jwt.sign({ id: user._id, gmail: user.gmail }, jwtSecret, { expiresIn: "1h" });

    
    const resetLink = `http://localhost:3000/updatepassword/${resetToken}`;
    sendPasswordResetEmail(gmail, resetLink);

    client.close();
    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});


app.put("/api/update-password/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");

    const result = await db.collection("videos").updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: { password: hashedPassword } }
    );

    client.close();

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update password" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});










app.get("/api/videos", async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("reactdb");
    const videos = await db.collection("videos").find().toArray();
    
    client.close();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
});












app.listen(5000, () => console.log("Server running on http://localhost:5000"));
