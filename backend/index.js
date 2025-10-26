import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Working" });
});

app.listen(3000, () => {
  console.log("server started");
});
