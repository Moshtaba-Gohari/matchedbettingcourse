require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// För att kunna läsa form-data
app.use(express.urlencoded({ extended: true }));

// Visa startsidan
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Hantera fake BankID-login
app.post("/login", (req, res) => {
  // Här låtsas vi att användaren verifierats
  console.log("Användaren är nu verifierad (fejk)");

  // Skicka tillgång – vi visar en Discord invite-länk
  res.send(`
    <h2>Verifiering lyckades!</h2>
    <p>Klicka här för att gå med i Discord:</p>
    <a href="https://discord.gg/din-länk-här">Gå med i kursen</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});