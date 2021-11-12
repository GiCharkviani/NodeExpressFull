const path = require("path");

const express = require("express");

const app = express();

const error = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user
        next()
    }).catch(console.log)
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(error.notFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
  // .sync({force: true})
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
      if(!user){
        return User.create({name: 'Gio', email: 'gi.charkviani@gmail.com'})
      }
      return user
  })
  .then(user => {
      return user.createCart();
  })
  .then(cart => {
    app.listen(3000, console.log("Server is running"));
  })
  .catch(console.log);

/**commented data */

// const server = http.createServer(app);
// server.listen(3000, () => {
//     console.log('server is runing')
// });
