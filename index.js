// index.js – Enkel version utan BankID just nu

const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Startsida
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// "Fejkad" BankID-inloggning – redirectar direkt till success
app.post("/login", (req, res) => {
  console.log("Användaren är nu verifierad (fejk)");
  res.sendFile(path.join(__dirname, "success.html"));
});

// Success-sidan
app.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});

// Starta server
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
