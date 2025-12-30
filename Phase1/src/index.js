require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/articles", articleRoutes);

async function startServer() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
}

startServer();
