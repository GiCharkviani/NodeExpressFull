const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

app.use(express.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // იგი შემოუშვებს კონკრეტულ ან ნებისმიერ (*) უცხო რექვესს
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); // იგი ნებას დართავს უცხო რექვესტებს, რომ გამოიყენონ კონკრეტული მეთოდები
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // იგი დააწესებს ან მოთხოვს, სპეციალურ ჰედერებს რომ შეიცავდნენ რექვესტები, რათა პასუხი დაუბრუნოს. აქაც შესაძლოა *-ის გამოყენება
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(
    "mongodb+srv://giorgi:charkviani1616@cluster0.bobiq.mongodb.net/postsApp?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080, () => {
      console.log("Server connected on 8080 port!");
    });
  })
  .catch(console.log);
