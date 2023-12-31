const express = require('express');
const app = express();

const dbconnect = require("./config/connectToDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const trackrouter = require("./routes/trackRoutes");
const albumsRouter = require("./routes/albumRoutes");

const { ConnectCloadinary } = require("./config/Coudinary");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 4000;

// connect database
dbconnect();

// middleware
const bodyparser = require("body-parser");

app.use(cookieParser());
app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp"
  })
);

ConnectCloadinary();

app.use("/api/v1/tracks",trackrouter);
app.use("/api/v1/Album",albumsRouter);


// default route
app.get("/api", (req, res) => {
  res.json({
    message: "Your server is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
