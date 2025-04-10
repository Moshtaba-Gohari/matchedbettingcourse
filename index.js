// index.js – med BankID testflöde

const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const app = express();

const PORT = process.env.PORT || 3000;

// Testkonfiguration för BankID
const bankidConfig = {
  baseUrl: "https://appapi2.test.bankid.com/rp/v5",
  pfx: "", // produktion: certifikat här
  passphrase: ""
};

app.use(express.urlencoded({ extended: true }));

// Startsidan
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Starta BankID-inloggning (testläge)
app.get("/start-bankid", async (req, res) => {
  try {
    const response = await axios.post(
      `${bankidConfig.baseUrl}/auth`,
      {
        endUserIp: req.ip,
        personalMessage: "Du godkänner att köpa BonusKursen för 2000 kr. Fakturan skickas nästa måndag.",
        requirement: {
          allowFingerprint: true
        }
      },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const { orderRef, autoStartToken } = response.data;

    const html = `
      <html>
        <head><title>Startar BankID...</title></head>
        <body style="text-align: center; font-family: sans-serif; padding-top: 50px;">
          <h2>Starta BankID</h2>
          <p>Om du använder mobilen: <a href="bankid:///?autostarttoken=${autoStartToken}">Öppna BankID</a></p>
          <p>Om du använder datorn: Skanna QR-koden nedan med BankID-appen</p>
          <img src="https://app.bankid.com/qr?autostarttoken=${autoStartToken}&redirect=null" />
          <script>
            setTimeout(() => {
              window.location.href = "/check-status?orderRef=${orderRef}";
            }, 3000);
          </script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Fel vid /start-bankid:", err);
    res.status(500).send("Kunde inte starta BankID-session.");
  }
});

// Kontrollera inloggningsstatus
app.get("/check-status", async (req, res) => {
  const { orderRef } = req.query;

  try {
    const response = await axios.post(
      `${bankidConfig.baseUrl}/collect`,
      { orderRef },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const status = response.data.status;

    if (status === "complete") {
      res.redirect("/success.html");
    } else if (status === "pending") {
      res.send(`
        <html><body>
        <p>Väntar på verifiering...</p>
        <script>setTimeout(() => {
          window.location.href = "/check-status?orderRef=${orderRef}";
        }, 3000);</script>
        </body></html>
      `);
    } else {
      res.send(`<p>Status: ${status}</p>`);
    }
  } catch (err) {
    console.error("Fel vid /check-status:", err);
    res.status(500).send("Fel vid kontroll av BankID-status.");
  }
});

// Verifieringssida efter lyckad inloggning
app.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});

// Starta server
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
