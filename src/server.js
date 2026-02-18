const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hotel API running ✅" });
});

// TODO: routes API (plus tard)
// app.use("/api/chambres", ...)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
