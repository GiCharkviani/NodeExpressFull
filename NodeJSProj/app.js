const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const errorController = require("./controllers/error");

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("619bd8f98fc91fd080263549")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(console.log);
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

mongoose
  .connect(
    "mongodb+srv://giorgi:charkviani1616@cluster0.bobiq.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Gio",
          email: "gi.charkviani@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000, () => {
      console.log("connected");
    });
  })
  .catch(console.log);
