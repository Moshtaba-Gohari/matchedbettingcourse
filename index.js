require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

// ✅ Använd Render’s port om den finns, annars 3000 lokalt
const PORT = process.env.PORT || 3000;

// För att kunna läsa formulärdata
app.use(express.urlencoded({ extended: true }));

// Serve login-sidan
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Hantera fejkad BankID-login
app.post("/login", (req, res) => {
  // Här låtsas vi att användaren verifierats
  console.log("Användaren är nu verifierad (fejk)");

  // Visa Discord-invite (byt ut mot er riktiga länk)
  res.send(`
    <h2>Verifiering lyckades!</h2>
    <p>Klicka här för att gå med i Discord:</p>
    <a href="https://discord.gg/din-länk-här">Gå med i kursen</a>
  `);
});

// Starta servern
app.listen(PORT, () => {
  console.log(`✅ Servern körs på http://localhost:${PORT}`);
});