import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";

export default function Register() {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [gmailTouched, setGmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isNameValid = name.length >= 3;
  const isGmailValid = gmail.includes("@gmail.com");
  const isPasswordValid = password.length > 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNameValid) {
      alert("Name is invalid");
      return;
    }
    if (!isGmailValid) {
      alert("Gmail is invalid");
      return;
    }
    if (!isPasswordValid) {
      alert("Password is invalid");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, gmail, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 8,
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameTouched(true)}
            error={nameTouched && !isNameValid}
            helperText={nameTouched && !isNameValid && "Name is invalid"}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            onFocus={() => setGmailTouched(true)}
            error={gmailTouched && !isGmailValid}
            helperText={gmailTouched && !isGmailValid && "Gmail is invalid"}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordTouched(true)}
            error={passwordTouched && !isPasswordValid}
            helperText={passwordTouched && !isPasswordValid && "Password is invalid"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isNameValid || !isGmailValid || !isPasswordValid}
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}
















