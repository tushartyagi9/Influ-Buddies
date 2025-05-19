import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Middleware to serve static files from the "public" folder
app.use(express.static(__dirname + "/public"));

// Serve BrandBuddies.html on the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/BrandBuddies.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
