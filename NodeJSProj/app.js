const path = require("path");

const express = require("express");

const app = express();

const error = require("./controllers/error");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(error.notFound);

app.listen(3000, console.log("Server is running"));

/**commented data */

// const server = http.createServer(app);
// server.listen(3000, () => {
//     console.log('server is runing')
// });
