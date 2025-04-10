require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// För att kunna läsa formulärdata
app.use(express.urlencoded({ extended: true }));

// Visa startsidan (login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Hantera "BankID"-inloggning (fejkad just nu)
app.post("/login", (req, res) => {
  console.log("Användaren är nu verifierad (fejk)");
  res.sendFile(path.join(__dirname, "success.html"));
});

// Starta servern
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});