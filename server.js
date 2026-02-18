const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hotel API running ✅" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
