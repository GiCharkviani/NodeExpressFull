const path = require("path");

const express = require("express");

const app = express();


const errorController = require("./controllers/error");
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById('619549cebe6d6a26399a53d2')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id)
        next()
    })
    .catch(console.log)
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

mongoConnect(() => {
  app.listen(3000, console.log("Server is running"));
})
